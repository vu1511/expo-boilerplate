#!/usr/bin/env node

/**
 * Setup Local Build Environment
 *
 * This script checks and sets up everything needed for local EAS builds:
 * - EAS CLI installation
 * - EAS authentication
 * - Build dependencies (Android SDK, Xcode)
 * - Credentials setup
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    })
  } catch (error) {
    if (options.ignoreError) return null
    throw error
  }
}

function checkCommand(command, name) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function checkEASCLI() {
  log('\n📦 Checking EAS CLI...', 'cyan')

  if (checkCommand('eas', 'EAS CLI')) {
    const version = exec('eas --version', { silent: true }).trim()
    log(`✓ EAS CLI installed (${version})`, 'green')
    return true
  } else {
    log('✗ EAS CLI not found', 'red')
    return false
  }
}

function checkEASAuth() {
  log('\n🔐 Checking EAS authentication...', 'cyan')

  try {
    const result = exec('eas whoami', { silent: true, ignoreError: true })
    if (result) {
      const username = result.trim()
      log(`✓ Logged in as: ${username}`, 'green')
      return true
    }
  } catch {}

  log('✗ Not logged in to EAS', 'yellow')
  return false
}

function checkAndroidSDK() {
  log('\n🤖 Checking Android SDK...', 'cyan')

  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT

  if (!androidHome) {
    log('✗ ANDROID_HOME not set', 'yellow')
    log('  Android builds will not work until SDK is installed', 'dim')
    return false
  }

  if (fs.existsSync(androidHome)) {
    log(`✓ Android SDK found: ${androidHome}`, 'green')
    return true
  } else {
    log('✗ Android SDK path exists but directory not found', 'yellow')
    return false
  }
}

function checkXcode() {
  log('\n🍎 Checking Xcode (macOS only)...', 'cyan')

  if (process.platform !== 'darwin') {
    log('⊘ Skipped (not on macOS)', 'dim')
    return false
  }

  if (checkCommand('xcodebuild', 'Xcode')) {
    const version = exec('xcodebuild -version', { silent: true }).split('\n')[0]
    log(`✓ ${version} installed`, 'green')
    return true
  } else {
    log('✗ Xcode not found', 'yellow')
    log('  iOS builds will not work until Xcode is installed', 'dim')
    return false
  }
}

function checkEnvFiles() {
  log('\n🔑 Checking environment files...', 'cyan')

  const envFiles = ['keys.development.json', 'keys.staging.json', 'keys.production.json']

  const missing = []
  const existing = []

  for (const file of envFiles) {
    const filepath = path.join(process.cwd(), file)
    if (fs.existsSync(filepath)) {
      existing.push(file)
    } else {
      missing.push(file)
    }
  }

  if (existing.length > 0) {
    log(`✓ Found: ${existing.join(', ')}`, 'green')
  }

  if (missing.length > 0) {
    log(`✗ Missing: ${missing.join(', ')}`, 'yellow')
    log('  Run: yarn env:setup to create from keys.example.json', 'dim')
    return false
  }

  return true
}

function checkCredentials() {
  log('\n🎫 Checking EAS credentials...', 'cyan')

  try {
    log('  Checking Android keystore...', 'dim')
    const androidResult = exec('eas credentials --platform android', {
      silent: true,
      ignoreError: true,
    })

    if (androidResult && androidResult.includes('Keystore')) {
      log('✓ Android credentials configured', 'green')
    } else {
      log('⚠ Android credentials may need setup', 'yellow')
    }
  } catch {
    log('⚠ Could not check Android credentials', 'yellow')
  }

  if (process.platform === 'darwin') {
    try {
      log('  Checking iOS certificates...', 'dim')
      const iosResult = exec('eas credentials --platform ios', {
        silent: true,
        ignoreError: true,
      })

      if (iosResult && iosResult.includes('Distribution Certificate')) {
        log('✓ iOS credentials configured', 'green')
      } else {
        log('⚠ iOS credentials may need setup', 'yellow')
      }
    } catch {
      log('⚠ Could not check iOS credentials', 'yellow')
    }
  }
}

async function installEASCLI() {
  log('\n📦 Installing EAS CLI...', 'cyan')

  const answer = await question('Install EAS CLI globally? (y/n): ')

  if (answer.toLowerCase() === 'y') {
    try {
      log('Installing...', 'dim')
      exec('npm install -g eas-cli')
      log('✓ EAS CLI installed successfully', 'green')
      return true
    } catch {
      log('✗ Failed to install EAS CLI', 'red')
      log('  Try manually: npm install -g eas-cli', 'dim')
      return false
    }
  }

  return false
}

async function loginToEAS() {
  log('\n🔐 Logging in to EAS...', 'cyan')

  const answer = await question('Login to EAS now? (y/n): ')

  if (answer.toLowerCase() === 'y') {
    try {
      log('Opening browser for authentication...', 'dim')
      exec('eas login')
      return true
    } catch {
      log('✗ Failed to login', 'red')
      return false
    }
  }

  return false
}

async function setupCredentials() {
  log('\n🎫 Setting up EAS credentials...', 'cyan')

  const answer = await question('Setup credentials now? (y/n): ')

  if (answer.toLowerCase() !== 'y') {
    return false
  }

  // Android credentials
  const setupAndroid = await question('Setup Android credentials? (y/n): ')
  if (setupAndroid.toLowerCase() === 'y') {
    try {
      log('Setting up Android keystore...', 'dim')
      log('Follow the prompts to generate or upload your keystore', 'dim')
      exec('eas credentials --platform android')
    } catch {
      log('⚠ Android credential setup skipped or failed', 'yellow')
    }
  }

  // iOS credentials (macOS only)
  if (process.platform === 'darwin') {
    const setupIOS = await question('Setup iOS credentials? (y/n): ')
    if (setupIOS.toLowerCase() === 'y') {
      try {
        log('Setting up iOS certificates...', 'dim')
        log('Follow the prompts to generate or upload certificates', 'dim')
        exec('eas credentials --platform ios')
      } catch {
        log('⚠ iOS credential setup skipped or failed', 'yellow')
      }
    }
  }
}

// Main setup flow
async function main() {
  console.clear()
  log('╔════════════════════════════════════════════════════════════════╗', 'bright')
  log('║                  🚀 Local Build Setup                          ║', 'bright')
  log('║               Prepare for EAS Local Builds                     ║', 'bright')
  log('╚════════════════════════════════════════════════════════════════╝', 'bright')

  // Phase 1: Check current setup
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  Phase 1: System Check', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')

  const hasEAS = checkEASCLI()
  const hasAuth = hasEAS && checkEASAuth()
  const hasAndroid = checkAndroidSDK()
  const hasXcode = checkXcode()
  const hasEnv = checkEnvFiles()

  if (hasAuth) {
    checkCredentials()
  }

  // Phase 2: Setup missing components
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  Phase 2: Setup', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')

  if (!hasEAS) {
    await installEASCLI()
  }

  if (!hasAuth && checkCommand('eas', 'EAS CLI')) {
    await loginToEAS()
  }

  if (!hasEnv) {
    log('\n🔑 Setting up environment files...', 'cyan')
    const setupEnv = await question('Run yarn env:setup? (y/n): ')
    if (setupEnv.toLowerCase() === 'y') {
      try {
        exec('yarn env:setup')
        log('✓ Environment files created', 'green')
        log('  Edit keys.development.json with your configuration', 'dim')
      } catch {
        log('✗ Failed to setup environment files', 'red')
      }
    }
  }

  if (checkEASAuth()) {
    await setupCredentials()
  }

  // Phase 3: Summary and next steps
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
  log('  Setup Complete!', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')

  log('\n📱 Ready to build locally!', 'green')
  log('\n✨ Available commands:', 'bright')
  log('  yarn build              - Interactive build menu', 'cyan')
  log('  yarn build:local        - Build both platforms', 'cyan')
  log('  yarn build:local:android - Build Android APK', 'cyan')
  log('  yarn build:local:ios    - Build iOS app (macOS only)', 'cyan')

  if (!hasAndroid) {
    log('\n⚠ Warning: Android SDK not found', 'yellow')
    log('  Install Android Studio to build for Android', 'dim')
    log('  https://developer.android.com/studio', 'dim')
  }

  if (!hasXcode && process.platform === 'darwin') {
    log('\n⚠ Warning: Xcode not found', 'yellow')
    log('  Install Xcode from App Store to build for iOS', 'dim')
  }

  log('\n💡 Tips:', 'bright')
  log('  • Local builds are 100% FREE (no EAS subscription needed)', 'dim')
  log('  • Builds run on your machine (faster for development)', 'dim')
  log('  • Credentials are securely stored in Expo cloud', 'dim')
  log('  • First build may take 15-30 minutes', 'dim')

  log('\n📖 Documentation:', 'bright')
  log('  • docs/CI_CD.md - Complete CI/CD guide', 'dim')
  log('  • docs/CI_CD_QUICKSTART.md - Quick start checklist', 'dim')

  log('')

  rl.close()
}

main().catch((error) => {
  console.error(`\n${colors.red}Error:${colors.reset}`, error.message)
  process.exit(1)
})
