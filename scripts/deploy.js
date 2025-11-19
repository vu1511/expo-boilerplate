#!/usr/bin/env node

/**
 * Firebase App Distribution Deploy Script
 *
 * Deploys existing build artifacts to Firebase App Distribution.
 * Can be run standalone or as part of build workflow.
 *
 * Usage:
 *   node scripts/deploy.js
 *   yarn deploy
 */

const readline = require('readline')
const fs = require('fs')
const path = require('path')
const { deploy } = require('./lib/deploy-core')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// Firebase functions are now imported from shared module

// Platform and profile options
const platforms = [
  {
    key: '1',
    name: 'Android',
    value: 'android',
    emoji: '🤖',
    description: 'Deploy Android builds (APK/AAB)',
  },
  {
    key: '2',
    name: 'iOS',
    value: 'ios',
    emoji: '🍎',
    description: 'Deploy iOS builds (IPA)',
  },
  {
    key: '3',
    name: 'All Platforms',
    value: 'all',
    emoji: '📱',
    description: 'Deploy all available builds',
  },
]

const profiles = [
  {
    key: '1',
    name: 'Development',
    value: 'development',
    emoji: '🔨',
    description: 'Development environment',
  },
  {
    key: '2',
    name: 'Staging',
    value: 'staging',
    emoji: '🚧',
    description: 'Staging environment for testing',
  },
  {
    key: '3',
    name: 'Production',
    value: 'production',
    emoji: '🚀',
    description: 'Production environment',
  },
]

function findBuildArtifacts(platformFilter = 'all', profileFilter = null) {
  const outputDir = path.join(process.cwd(), 'build-output')
  const artifacts = []

  if (!fs.existsSync(outputDir)) {
    return []
  }

  try {
    const files = fs.readdirSync(outputDir)

    // Filter by platform and profile
    if (platformFilter === 'all' || platformFilter === 'android') {
      // Look for Android files (APK/AAB)
      const androidFiles = files.filter((f) => {
        if (!f.endsWith('.apk') && !f.endsWith('.aab')) return false

        // If profile filter is specified, only match artifacts with that profile
        if (profileFilter) {
          // Match pattern: app-android-{profile}.{ext}
          const pattern = new RegExp(`^app-android-${profileFilter}\\.(apk|aab)$`)
          return pattern.test(f)
        }

        return true
      })

      artifacts.push(
        ...androidFiles.map((f) => ({
          path: path.join(outputDir, f),
          platform: 'android',
          type: f.endsWith('.apk') ? 'apk' : 'aab',
          name: f,
        })),
      )
    }

    if (platformFilter === 'all' || platformFilter === 'ios') {
      // Look for iOS files (IPA)
      const iosFiles = files.filter((f) => {
        if (!f.endsWith('.ipa')) return false

        // If profile filter is specified, only match artifacts with that profile
        if (profileFilter) {
          // Match pattern: app-ios-{profile}.ipa
          const pattern = new RegExp(`^app-ios-${profileFilter}\\.ipa$`)
          return pattern.test(f)
        }

        return true
      })

      artifacts.push(
        ...iosFiles.map((f) => ({
          path: path.join(outputDir, f),
          platform: 'ios',
          type: 'ipa',
          name: f,
        })),
      )
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return artifacts
}

function getKeysFilePath(profile) {
  const keysFileName = `keys.${profile}.json`
  const keysFilePath = path.join(process.cwd(), keysFileName)

  if (fs.existsSync(keysFilePath)) {
    return keysFilePath
  }

  return null
}

// Display functions
function displayHeader() {
  console.clear()
  log('╔════════════════════════════════════════════════════════════════╗', 'bright')
  log('║          📤 Firebase App Distribution - Deploy                 ║', 'bright')
  log('╚════════════════════════════════════════════════════════════════╝', 'bright')
  log('')
}

function displayPlatformMenu(availablePlatforms) {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  Step 1: Select Platform', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('')

  platforms.forEach((platform) => {
    const available = availablePlatforms[platform.value]
    const status = available
      ? `${colors.green}✓ Available${colors.reset}`
      : `${colors.dim}✗ No artifacts${colors.reset}`

    log(
      `  ${colors.bright}[${platform.key}]${colors.reset} ${platform.emoji} ${platform.name} - ${status}`,
      available ? 'reset' : 'dim',
    )
    log(`      ${platform.description}`, 'dim')
    log('')
  })
}

function displayProfileMenu() {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  Step 2: Select Build Profile', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('')

  profiles.forEach((profile) => {
    log(`  ${colors.bright}[${profile.key}]${colors.reset} ${profile.emoji} ${profile.name}`, 'reset')
    log(`      ${profile.description}`, 'dim')
    log('')
  })
}

async function displayDeploySummary(platform, profile, artifacts, releaseNotes) {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  Deployment Summary', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('')
  log(`  Platform:      ${colors.bright}${platform.name}${colors.reset}`)
  log(`  Profile:       ${colors.bright}${profile.name}${colors.reset}`)
  log(`  Artifacts:     ${colors.bright}${artifacts.length}${colors.reset} file(s)`)
  log(`  Release notes: ${colors.bright}${releaseNotes}${colors.reset}`)
  log('')

  log('📦 Files to deploy:', 'cyan')
  const artifactInfo = await Promise.all(
    artifacts.map(async (artifact) => {
      const fileName = path.basename(artifact.path)
      const size = fs.existsSync(artifact.path)
        ? `${(fs.statSync(artifact.path).size / 1024 / 1024).toFixed(2)} MB`
        : 'unknown size'
      const icon = artifact.platform === 'android' ? '🤖' : '🍎'
      return { fileName, size, icon }
    }),
  )
  artifactInfo.forEach((info, index) => {
    log(`  ${index + 1}. ${info.icon} ${info.fileName} (${info.size})`, 'dim')
  })
  log('')
}

async function main() {
  // Step 1: Platform selection
  displayHeader()

  // Check available artifacts by platform
  const allArtifacts = findBuildArtifacts('all')

  if (allArtifacts.length === 0) {
    log('✗ No build artifacts found', 'red')
    log('', 'reset')
    log('Build directory: ./build-output/', 'dim')
    log('Expected files: *.apk, *.aab, *.ipa', 'dim')
    log('', 'reset')
    log('Build first with:', 'yellow')
    log('  yarn build', 'cyan')
    log('', 'reset')
    rl.close()
    process.exit(1)
  }

  const availablePlatforms = {
    android: allArtifacts.some((a) => a.platform === 'android'),
    ios: allArtifacts.some((a) => a.platform === 'ios'),
    all: allArtifacts.length > 0,
  }

  displayPlatformMenu(availablePlatforms)

  const platformChoice = await question(`${colors.bright}Select platform [1-3]: ${colors.reset}`)
  const selectedPlatform = platforms.find((p) => p.key === platformChoice)

  if (!selectedPlatform) {
    log('\n✗ Invalid selection', 'red')
    rl.close()
    process.exit(1)
  }

  // Step 2: Profile selection
  log('')
  displayProfileMenu()

  const profileChoice = await question(`${colors.bright}Select profile [1-3]: ${colors.reset}`)
  const selectedProfile = profiles.find((p) => p.key === profileChoice)

  if (!selectedProfile) {
    log('\n✗ Invalid selection', 'red')
    rl.close()
    process.exit(1)
  }

  // Filter artifacts by selected platform AND profile
  const artifacts = findBuildArtifacts(selectedPlatform.value, selectedProfile.value)

  if (artifacts.length === 0) {
    log('\n✗ No artifacts found matching selected platform and profile', 'red')
    log('', 'reset')
    log(`Expected artifact naming pattern:`, 'dim')
    if (selectedPlatform.value === 'all') {
      log(`  • app-android-${selectedProfile.value}.apk (or .aab)`, 'dim')
      log(`  • app-ios-${selectedProfile.value}.ipa`, 'dim')
    } else if (selectedPlatform.value === 'android') {
      log(`  • app-android-${selectedProfile.value}.apk (or .aab)`, 'dim')
    } else {
      log(`  • app-ios-${selectedProfile.value}.ipa`, 'dim')
    }
    log('', 'reset')
    rl.close()
    process.exit(1)
  }

  // Get keys file for selected profile
  const keysFilePath = getKeysFilePath(selectedProfile.value)

  if (!keysFilePath) {
    log('', 'reset')
    log(`⚠ Warning: keys.${selectedProfile.value}.json not found`, 'yellow')
    log('  Deployment may fail without Firebase App IDs', 'dim')
    log('', 'reset')
  }

  // Step 3: Release notes
  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  Step 3: Release Notes', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('')

  if (selectedProfile.value === 'production') {
    log('Enter release notes for App Store submission:', 'cyan')
    log('  • iOS: Must be added manually in App Store Connect (--what-to-test requires Enterprise plan)', 'dim')
    log('  • Android: Must be added manually in Google Play Console (not supported by CLI)', 'dim')
    log('(Press Enter for default: "Build from production profile")', 'dim')
  } else {
    log('Enter release notes for Firebase App Distribution:', 'cyan')
    log(`(Press Enter for default: "Build from ${selectedProfile.value} profile")`, 'dim')
  }
  log('')

  const releaseNotesInput = await question(`${colors.bright}Release notes: ${colors.reset}`)
  const releaseNotes = releaseNotesInput.trim() || `Build from ${selectedProfile.value} profile`

  // Step 4: Confirmation
  log('')
  await displayDeploySummary(selectedPlatform, selectedProfile, artifacts, releaseNotes)

  const confirm = await question(`${colors.bright}Continue with deployment? (y/n): ${colors.reset}`)

  if (confirm.toLowerCase() !== 'y') {
    log('\n✗ Deployment cancelled', 'yellow')
    rl.close()
    process.exit(0)
  }

  // Step 5: Deploy
  log('')
  if (selectedProfile.value === 'production') {
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
    log('  Submitting to App Stores...', 'bright')
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
  } else {
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
    log('  Deploying to Firebase...', 'bright')
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
  }
  log('')

  // Use shared deploy logic
  const result = await deploy(artifacts, selectedProfile.value, {
    log,
    question,
    colors,
    keysFilePath,
    nonInteractive: true,
    releaseNotes,
  })

  rl.close()
  process.exit(result.success ? 0 : 1)
}

main().catch((error) => {
  console.error(`\n${colors.red}Error:${colors.reset}`, error.message)
  rl.close()
  process.exit(1)
})
