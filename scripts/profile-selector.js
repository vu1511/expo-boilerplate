/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const ENVIRONMENTS = ['development', 'staging', 'production']
const ROOT_DIR = path.join(__dirname, '..')
const ENCRYPTED_DIR = path.join(ROOT_DIR, 'config', 'encrypted')

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function getEnvironmentStatus() {
  return ENVIRONMENTS.map((env) => {
    const decryptedFile = path.join(ROOT_DIR, `keys.${env}.json`)
    const encryptedFile = path.join(ENCRYPTED_DIR, `keys.${env}.json.gpg`)

    return {
      name: env,
      decrypted: fs.existsSync(decryptedFile),
      encrypted: fs.existsSync(encryptedFile),
    }
  })
}

function displayEnvironmentMenu(envStatuses, command) {
  const commandName = command === 'start' ? 'Start' : 'Prebuild'

  console.log(`\n🚀 Select Profile for: ${commandName}\n`)

  envStatuses.forEach((env, index) => {
    const status = env.decrypted ? '✅ Ready' : '❌ Not decrypted'
    const isDefault = env.name === 'development' ? '(default)' : ''
    console.log(`  ${index + 1}. ${env.name.padEnd(12)} ${status} ${isDefault}`)
  })

  console.log()
}

async function decryptEnvironment(env) {
  console.log(`\n⚠️  Environment '${env}' is not decrypted yet.`)
  const shouldDecrypt = await question('Do you want to decrypt it now? (y/n): ')

  if (shouldDecrypt.toLowerCase() !== 'y') {
    console.log('\n❌ Cannot proceed without decrypted environment.')
    console.log(`   Run: yarn env\n`)
    return false
  }

  const password = await question('\nEnter decryption password: ')

  try {
    const inputFile = path.join(ENCRYPTED_DIR, `keys.${env}.json.gpg`)
    const outputFile = path.join(ROOT_DIR, `keys.${env}.json`)

    if (!fs.existsSync(inputFile)) {
      console.error(`\n❌ Encrypted file not found: ${inputFile}`)
      console.error(`   Run: yarn env:encrypt first\n`)
      return false
    }

    execSync(`gpg --batch --yes --passphrase "${password}" --decrypt -o "${outputFile}" "${inputFile}"`, {
      stdio: 'pipe',
    })

    console.log(`✅ Successfully decrypted ${env} environment`)
    return true
  } catch (error) {
    console.error(`\n❌ Decryption failed. Wrong password?\n`)
    return false
  }
}

async function selectProfile(command) {
  const envStatuses = getEnvironmentStatus()

  // Check if any environment is available
  const hasDecrypted = envStatuses.some((env) => env.decrypted)
  const hasEncrypted = envStatuses.some((env) => env.encrypted)

  if (!hasDecrypted && !hasEncrypted) {
    console.error('\n❌ No environment files found!')
    console.error('\n📝 Quick setup:')
    console.error('  1. yarn env:setup           # Create example file')
    console.error('  2. Edit keys.*.json files   # Add your values')
    console.error('  3. yarn env:encrypt         # Encrypt files')
    console.error('  4. yarn start               # Try again\n')
    rl.close()
    process.exit(1)
  }

  displayEnvironmentMenu(envStatuses, command)

  // If only one environment is available and ready, use it automatically
  const readyEnvs = envStatuses.filter((env) => env.decrypted)
  if (readyEnvs.length === 1 && command === 'start') {
    const selectedEnv = readyEnvs[0].name
    console.log(`📦 Auto-selected: ${selectedEnv} (only available environment)\n`)
    rl.close()
    return selectedEnv
  }

  const choice = await question(`Select profile (1-${envStatuses.length}) [default: 1]: `)
  const envIndex = choice.trim() === '' ? 0 : parseInt(choice) - 1

  if (envIndex < 0 || envIndex >= envStatuses.length) {
    console.error('❌ Invalid selection')
    rl.close()
    process.exit(1)
  }

  const selectedEnv = envStatuses[envIndex]

  // If not decrypted, offer to decrypt
  if (!selectedEnv.decrypted) {
    const success = await decryptEnvironment(selectedEnv.name)
    if (!success) {
      rl.close()
      process.exit(1)
    }
  }

  rl.close()
  return selectedEnv.name
}

function executeCommand(profile, command, args) {
  const keysFile = `keys.${profile}.json`

  console.log(`\n🎯 Profile: ${profile}`)
  console.log(`📦 Keys file: ${keysFile}`)

  // Build the command based on type
  let fullCommand = ''

  if (command === 'start') {
    fullCommand = `KEYSFILE=${keysFile} expo start ${args.join(' ')}`
  } else if (command === 'prebuild') {
    // Check if --clean flag is present
    const hasClean = args.includes('--clean')
    const otherArgs = args.filter((arg) => arg !== '--clean')
    const cleanFlag = hasClean ? '--clean' : ''

    fullCommand = `KEYSFILE=${keysFile} expo prebuild ${cleanFlag} ${otherArgs.join(' ')}`
  } else if (command === 'ios') {
    fullCommand = `KEYSFILE=${keysFile} expo run:ios ${args.join(' ')}`
  } else if (command === 'android') {
    fullCommand = `KEYSFILE=${keysFile} expo run:android ${args.join(' ')}`
  } else {
    console.error(`❌ Unknown command: ${command}`)
    process.exit(1)
  }

  console.log(`🚀 Running: ${fullCommand}\n`)

  try {
    // Execute command and inherit stdio so output is shown
    execSync(fullCommand, { stdio: 'inherit', cwd: ROOT_DIR })
  } catch (error) {
    console.error(`\n❌ Command failed with exit code: ${error.status}`)
    process.exit(error.status || 1)
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('\n❌ Usage: node profile-selector.js <command> [args...]')
    console.error('\nExamples:')
    console.error('  node profile-selector.js start --dev-client')
    console.error('  node profile-selector.js prebuild --clean')
    console.error('  node profile-selector.js ios --device')
    console.error('  node profile-selector.js android --variant release\n')
    process.exit(1)
  }

  const command = args[0]
  const commandArgs = args.slice(1)

  // Validate command
  if (!['start', 'prebuild', 'ios', 'android'].includes(command)) {
    console.error(`\n❌ Invalid command: ${command}`)
    console.error('   Supported: start, prebuild, ios, android\n')
    process.exit(1)
  }

  try {
    const profile = await selectProfile(command)
    executeCommand(profile, command, commandArgs)
  } catch (error) {
    console.error(`\n❌ Error:`, error.message)
    rl.close()
    process.exit(1)
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Cancelled by user')
  rl.close()
  process.exit(0)
})

main()
