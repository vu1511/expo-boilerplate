/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const ENVIRONMENTS = ['development', 'staging', 'production']
const ENCRYPTED_DIR = path.join(__dirname, '..', 'config', 'encrypted')
const ROOT_DIR = path.join(__dirname, '..')

// Ensure encrypted directory exists
if (!fs.existsSync(ENCRYPTED_DIR)) {
  fs.mkdirSync(ENCRYPTED_DIR, { recursive: true })
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function checkGPG() {
  try {
    execSync('gpg --version', { stdio: 'pipe' })
    return true
  } catch (error) {
    console.error('\n❌ GPG is not installed!')
    console.error('\nPlease install GPG:')
    console.error('  macOS:   brew install gnupg')
    console.error('  Linux:   sudo apt-get install gnupg')
    console.error('  Windows: choco install gnupg\n')
    return false
  }
}

function encryptFile(env, password) {
  const inputFile = path.join(ROOT_DIR, `keys.${env}.json`)
  const outputFile = path.join(ENCRYPTED_DIR, `keys.${env}.json.gpg`)

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`)
    console.error(`   Create it first or run: yarn env:setup`)
    return false
  }

  try {
    // Encrypt using symmetric encryption with password
    execSync(
      `gpg --batch --yes --passphrase "${password}" --symmetric --cipher-algo AES256 -o "${outputFile}" "${inputFile}"`,
      { stdio: 'pipe' },
    )
    console.log(`✅ Encrypted: ${env.padEnd(12)} → config/encrypted/keys.${env}.json.gpg`)
    return true
  } catch (error) {
    console.error(`❌ Encryption failed for ${env}:`, error.message)
    return false
  }
}

function decryptFile(env, password) {
  const inputFile = path.join(ENCRYPTED_DIR, `keys.${env}.json.gpg`)
  const outputFile = path.join(ROOT_DIR, `keys.${env}.json`)

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Encrypted file not found: ${inputFile}`)
    console.error(`   Run: yarn env:encrypt first`)
    return false
  }

  try {
    // Decrypt using the password
    execSync(`gpg --batch --yes --passphrase "${password}" --decrypt -o "${outputFile}" "${inputFile}"`, {
      stdio: 'pipe',
    })
    console.log(`✅ Decrypted: ${env} → keys.${env}.json`)
    return true
  } catch (error) {
    console.error(`❌ Decryption failed for ${env}. Wrong password?`)
    return false
  }
}

async function encryptCommand() {
  console.log('\n🔐 Encrypt Environment Files\n')

  if (!checkGPG()) {
    rl.close()
    process.exit(1)
  }

  // Check which files exist
  const existingFiles = ENVIRONMENTS.filter((env) => fs.existsSync(path.join(ROOT_DIR, `keys.${env}.json`)))

  if (existingFiles.length === 0) {
    console.error('❌ No environment files found!')
    console.error('\nCreate them first:')
    console.error('  1. Run: yarn env:setup')
    console.error('  2. Copy to: keys.staging.json and keys.production.json')
    console.error('  3. Edit each file with actual values')
    console.error('  4. Run: yarn env:encrypt\n')
    rl.close()
    return
  }

  console.log('Found files to encrypt:')
  existingFiles.forEach((env) => {
    console.log(`  ✓ keys.${env}.json`)
  })
  console.log()

  const password = await question('Enter encryption password: ')
  const confirmPassword = await question('Confirm password: ')

  if (password !== confirmPassword) {
    console.error('\n❌ Passwords do not match!')
    rl.close()
    return
  }

  if (password.length < 8) {
    console.error('\n⚠️  Warning: Password is too short. Use at least 8 characters.')
    const proceed = await question('Continue anyway? (y/n): ')
    if (proceed.toLowerCase() !== 'y') {
      rl.close()
      return
    }
  }

  console.log('\nEncrypting files...\n')

  let success = 0
  for (const env of existingFiles) {
    if (encryptFile(env, password)) {
      success++
    }
  }

  console.log(`\n✅ Encrypted ${success}/${existingFiles.length} files`)
  console.log('\n📝 Next steps:')
  console.log('  1. git add config/encrypted/*.gpg')
  console.log('  2. git commit -m "Add encrypted environment files"')
  console.log('  3. git push')
  console.log('\n💡 Share the password securely with your team (1Password, etc.)')
  console.log('   Never share passwords via email or Slack!\n')

  rl.close()
}

async function decryptCommand() {
  console.log('\n🔓 Select Environment\n')

  if (!checkGPG()) {
    rl.close()
    process.exit(1)
  }

  // Check which encrypted files exist
  const availableEnvs = ENVIRONMENTS.filter((env) => fs.existsSync(path.join(ENCRYPTED_DIR, `keys.${env}.json.gpg`)))

  if (availableEnvs.length === 0) {
    console.error('❌ No encrypted files found!')
    console.error('\nRun: yarn env:encrypt first\n')
    rl.close()
    return
  }

  availableEnvs.forEach((env, index) => {
    const alreadyDecrypted = fs.existsSync(path.join(ROOT_DIR, `keys.${env}.json`))
    const status = alreadyDecrypted ? '(already decrypted)' : ''
    console.log(`  ${index + 1}. ${env.padEnd(12)} ${status}`)
  })

  const choice = await question('\nSelect environment (1-' + availableEnvs.length + '): ')
  const envIndex = parseInt(choice) - 1

  if (envIndex < 0 || envIndex >= availableEnvs.length) {
    console.error('❌ Invalid selection')
    rl.close()
    return
  }

  const env = availableEnvs[envIndex]
  const password = await question('\nEnter decryption password: ')

  console.log(`\nDecrypting ${env} environment...\n`)

  if (decryptFile(env, password)) {
    console.log(`\n✅ Environment set to: ${env}`)
    console.log('\n📝 Next steps:')
    console.log('  1. yarn prebuild:clean  (required after env change)')
    console.log('  2. yarn start')
    console.log('\n💡 Tip: Different bundle IDs allow multiple envs on one device\n')
  }

  rl.close()
}

async function listCommand() {
  console.log('\n📋 Available Encrypted Files:\n')

  const files = fs.existsSync(ENCRYPTED_DIR) ? fs.readdirSync(ENCRYPTED_DIR) : []
  const gpgFiles = files.filter((f) => f.endsWith('.gpg'))

  if (gpgFiles.length === 0) {
    console.log('  No encrypted files found.')
    console.log('\n📝 To get started:')
    console.log('  1. yarn env:setup')
    console.log('  2. Edit keys.development.json with your values')
    console.log('  3. Create keys.staging.json and keys.production.json')
    console.log('  4. yarn env:encrypt\n')
  } else {
    gpgFiles.forEach((file) => {
      const env = file.replace('keys.', '').replace('.json.gpg', '')
      const stats = fs.statSync(path.join(ENCRYPTED_DIR, file))
      const size = (stats.size / 1024).toFixed(1)
      console.log(`  ✓ ${env.padEnd(15)} ${size.padStart(6)} KB  (${new Date(stats.mtime).toLocaleDateString()})`)
    })
    console.log()
  }

  rl.close()
}

async function statusCommand() {
  console.log('\n📊 Environment Status:\n')

  const hasEncryptedDir = fs.existsSync(ENCRYPTED_DIR)

  for (const env of ENVIRONMENTS) {
    const decryptedFile = path.join(ROOT_DIR, `keys.${env}.json`)
    const encryptedFile = path.join(ENCRYPTED_DIR, `keys.${env}.json.gpg`)

    const decrypted = fs.existsSync(decryptedFile)
    const encrypted = hasEncryptedDir && fs.existsSync(encryptedFile)

    const decryptedStatus = decrypted ? '✅' : '❌'
    const encryptedStatus = encrypted ? '✅' : '❌'

    console.log(`  ${env.padEnd(15)} Decrypted: ${decryptedStatus}   Encrypted: ${encryptedStatus}`)
  }

  console.log()
  rl.close()
}

async function helpCommand() {
  console.log('\n🔐 Environment Manager\n')
  console.log('Secure environment configuration with GPG encryption\n')
  console.log('Commands:')
  console.log('  yarn env              Select and decrypt an environment')
  console.log('  yarn env:encrypt      Encrypt all environment files')
  console.log('  yarn env:list         List available encrypted files')
  console.log('  yarn env:status       Show encryption status')
  console.log('  yarn env:setup        Create initial development keys file')
  console.log('  yarn env:verify       Verify environment configuration\n')
  console.log('Workflow:')
  console.log('  1. First time setup:')
  console.log('     - yarn env:setup')
  console.log('     - Edit keys files with actual values')
  console.log('     - yarn env:encrypt')
  console.log('     - Commit encrypted files to git\n')
  console.log('  2. Daily usage:')
  console.log('     - yarn env')
  console.log('     - Select environment')
  console.log('     - Enter password')
  console.log('     - yarn prebuild:clean')
  console.log('     - yarn ios/android\n')
  console.log('Learn more: docs/CONFIGURATION.md\n')
  rl.close()
}

async function main() {
  const command = process.argv[2]

  switch (command) {
    case 'encrypt':
      await encryptCommand()
      break
    case 'decrypt':
    case 'select':
      await decryptCommand()
      break
    case 'list':
      await listCommand()
      break
    case 'status':
      await statusCommand()
      break
    case 'help':
    case '--help':
    case '-h':
      await helpCommand()
      break
    default:
      await decryptCommand() // Default to decrypt/select
  }
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message)
  rl.close()
  process.exit(1)
})
