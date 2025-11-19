#!/usr/bin/env node

/**
 * Interactive Local Build Script
 *
 * Provides an interactive menu for building locally with EAS:
 * - Select platform (Android, iOS, Both)
 * - Select profile (development, staging, production)
 * - Automatic environment setup
 * - Build status tracking
 */

const { execSync, spawn } = require('child_process')
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

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: 'inherit',
      ...options,
    })
  } catch (error) {
    throw error
  }
}

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function checkEASAuth() {
  try {
    execSync('eas whoami', {
      stdio: 'ignore',
      env: process.env,
    })
    return true
  } catch {
    return false
  }
}

function checkPlatformSupport() {
  const isMac = process.platform === 'darwin'
  const hasAndroid = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT

  return {
    android: !!hasAndroid,
    ios: isMac,
    isMac,
  }
}

function moveAndRenameArtifacts(outputDir, profile) {
  try {
    const rootFiles = fs.readdirSync(process.cwd())
    const artifactFiles = rootFiles.filter(
      (f) => (f.endsWith('.apk') || f.endsWith('.aab') || f.endsWith('.ipa')) && f.startsWith('build-'),
    )

    artifactFiles.forEach((file) => {
      const sourcePath = path.join(process.cwd(), file)

      let detectedPlatform = 'android'
      let ext = path.extname(file)

      if (file.endsWith('.ipa')) {
        detectedPlatform = 'ios'
      } else if (file.endsWith('.aab')) {
        detectedPlatform = 'android'
      } else if (file.endsWith('.apk')) {
        detectedPlatform = 'android'
      }

      const newFileName = `app-${detectedPlatform}-${profile}${ext}`
      const destPath = path.join(outputDir, newFileName)

      try {
        if (fs.existsSync(destPath)) {
          fs.unlinkSync(destPath)
          log(`  ✓ Removed old artifact: ${newFileName}`, 'dim')
        }

        if (sourcePath !== destPath) {
          fs.renameSync(sourcePath, destPath)
          log(`  ✓ Moved and renamed: ${file} → ${newFileName}`, 'green')
        }
      } catch (err) {
        if (err.code !== 'ENOENT') {
          log(`  ⚠ Could not move ${file}: ${err.message}`, 'yellow')
        }
      }
    })
  } catch (_error) {}
}

function findBuildArtifacts(outputDir, platform, profile) {
  const artifacts = []

  moveAndRenameArtifacts(outputDir, profile)

  try {
    const files = fs.readdirSync(outputDir)

    const platformsToCheck = platform === 'all' ? ['android', 'ios'] : [platform]

    for (const plat of platformsToCheck) {
      if (plat === 'android') {
        const androidFiles = files.filter(
          (f) => (f.endsWith('.apk') || f.endsWith('.aab')) && f.startsWith(`app-${plat}-${profile}`),
        )
        artifacts.push(
          ...androidFiles.map((f) => ({
            path: path.join(outputDir, f),
            platform: 'android',
            type: f.endsWith('.apk') ? 'apk' : 'aab',
          })),
        )
      }

      if (plat === 'ios') {
        const iosFiles = files.filter((f) => f.endsWith('.ipa') && f.startsWith(`app-${plat}-${profile}`))
        artifacts.push(
          ...iosFiles.map((f) => ({
            path: path.join(outputDir, f),
            platform: 'ios',
            type: 'ipa',
          })),
        )
      }
    }
  } catch (_error) {}

  return artifacts
}

const platforms = [
  {
    key: '1',
    name: 'Android',
    value: 'android',
    emoji: '🤖',
    description: 'Build APK or AAB for Android',
  },
  {
    key: '2',
    name: 'iOS',
    value: 'ios',
    emoji: '🍎',
    description: 'Build IPA for iOS (macOS only)',
    requiresMac: true,
  },
  {
    key: '3',
    name: 'Both Platforms',
    value: 'all',
    emoji: '📱',
    description: 'Build for Android and iOS',
    requiresMac: true,
  },
]

const profiles = [
  {
    key: '1',
    name: 'Development',
    value: 'development',
    emoji: '🔨',
    description: 'Dev client build with debugging (Firebase distribution)',
    output: 'APK (Android) / IPA (iOS)',
  },
  {
    key: '2',
    name: 'Staging',
    value: 'staging',
    emoji: '🚧',
    description: 'Test build for internal distribution',
    output: 'APK (Android) / IPA (iOS)',
  },
  {
    key: '3',
    name: 'Production',
    value: 'production',
    emoji: '🚀',
    description: 'Release build for app stores',
    output: 'AAB (Android) / IPA (iOS)',
  },
]

function displayHeader() {
  console.clear()
  log('╔════════════════════════════════════════════════════════════════╗', 'bright')
  log('║              📱 Local Build with EAS (100% FREE!)              ║', 'bright')
  log('╚════════════════════════════════════════════════════════════════╝', 'bright')
  log('')
}

function displayPlatformMenu(support) {
  log('Select Platform:', 'cyan')
  log('')

  platforms.forEach((platform) => {
    const available = platform.requiresMac ? support.ios : support.android
    const status = available ? '' : colors.dim + ' (not available)' + colors.reset

    if (available || !platform.requiresMac) {
      log(
        `  ${colors.bright}[${platform.key}]${colors.reset} ${platform.emoji} ${platform.name}${status}`,
        available ? 'reset' : 'dim',
      )
      log(`      ${platform.description}`, 'dim')
      log('')
    }
  })
}

function displayProfileMenu() {
  log('Select Build Profile:', 'cyan')
  log('')

  profiles.forEach((profile) => {
    log(`  ${colors.bright}[${profile.key}]${colors.reset} ${profile.emoji} ${profile.name}`, 'reset')
    log(`      ${profile.description}`, 'dim')
    log(`      Output: ${profile.output}`, 'dim')
    log('')
  })
}

function displayBuildSummary(platform, profile, releaseNotes = null) {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  Build Summary', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('')
  log(`  Platform: ${colors.bright}${platform.name}${colors.reset}`)
  log(`  Profile:  ${colors.bright}${profile.name}${colors.reset}`)

  const artifactFiles = []

  if (platform.value === 'all') {
    if (profile.value === 'production') {
      artifactFiles.push(`app-android-${profile.value}.aab`)
    } else {
      artifactFiles.push(`app-android-${profile.value}.apk`)
    }
    artifactFiles.push(`app-ios-${profile.value}.ipa`)
  } else if (platform.value === 'android') {
    if (profile.value === 'production') {
      artifactFiles.push(`app-android-${profile.value}.aab`)
    } else {
      artifactFiles.push(`app-android-${profile.value}.apk`)
    }
  } else if (platform.value === 'ios') {
    artifactFiles.push(`app-ios-${profile.value}.ipa`)
  }

  if (artifactFiles.length > 0) {
    log(`  Output:   ${colors.bright}${artifactFiles.join(', ')}${colors.reset}`)
  } else {
    log(`  Output:   ${profile.output}`)
  }
  log('')

  const estimatedTime = platform.value === 'all' ? '30-60 minutes' : '15-30 minutes'
  log(`  ⏱  Estimated time: ${estimatedTime}`, 'dim')
  log(`  💾 Build artifacts will be saved to: ./build-output/`, 'dim')

  if (releaseNotes) {
    log(`  📝 Release notes: ${colors.bright}${releaseNotes}${colors.reset}`, 'dim')
  }

  log('')
}

function displayProgress(platform, profile) {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
  log('  Starting Build...', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
  log('')
  log(`  ${colors.cyan}▶ Building ${platform.name} - ${profile.name}${colors.reset}`)
  log('')
  log('  💡 First build may take longer (downloading dependencies)', 'dim')
  log('  💡 Subsequent builds will be faster', 'dim')
  log('')
}

function displaySuccess(platform, profile, artifacts) {
  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
  log('  ✅ Build Completed Successfully!', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
  log('')
  log('📦 Build artifacts:', 'green')

  if (artifacts && artifacts.length > 0) {
    artifacts.forEach((artifact) => {
      const fileName = path.basename(artifact.path)
      const size = fs.existsSync(artifact.path)
        ? `${(fs.statSync(artifact.path).size / 1024 / 1024).toFixed(2)} MB`
        : 'unknown size'
      log(`  • ${fileName} (${size})`, 'dim')
    })
  } else {
    log('  • Check ./build-output/ directory', 'dim')
  }
  log('')

  if (profile.value === 'development') {
    log('📤 Distribute to testers:', 'cyan')
    log('  • Firebase App Distribution (automated below)', 'dim')
    log('  • Or install directly: adb install build-output/*.apk', 'dim')
    log('  • Or share APK/IPA directly', 'dim')
  } else if (profile.value === 'staging') {
    log('📤 Distribute to testers:', 'cyan')
    log('  • Firebase App Distribution (automated below)', 'dim')
    log('  • Or share APK/IPA directly', 'dim')
  } else {
    log('📤 Submit to stores:', 'cyan')
    if (platform.value === 'android' || platform.value === 'all') {
      log('  • eas submit --platform android', 'dim')
    }
    if (platform.value === 'ios' || platform.value === 'all') {
      log('  • eas submit --platform ios', 'dim')
    }
  }

  log('')
}

async function distributeToFirebase(artifacts, profile, releaseNotes = null) {
  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  📤 Firebase App Distribution', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('')

  const keysFileName = process.env.KEYSFILE || `keys.${profile.value}.json`
  const keysFilePath = path.join(process.cwd(), keysFileName)

  const result = await deploy(artifacts, profile.value, {
    log,
    question,
    colors,
    keysFilePath,
    nonInteractive: releaseNotes !== null,
    releaseNotes: releaseNotes,
  })

  return result.success
}

async function main() {
  const noDeploy = process.argv.includes('--no-deploy')

  if (!checkEASAuth()) {
    log('', 'reset')
    log('✗ Not logged in to EAS', 'red')
    log('', 'reset')
    log('Please run: eas login', 'yellow')
    log('Or run setup: yarn build:setup', 'yellow')
    log('', 'reset')
    rl.close()
    process.exit(1)
  }

  const support = checkPlatformSupport()

  // Step 1: Platform selection
  displayHeader()
  displayPlatformMenu(support)

  if (!support.android && !support.ios) {
    log('✗ No build platforms available', 'red')
    log('  • Install Android SDK for Android builds', 'dim')
    log('  • Install Xcode for iOS builds (macOS only)', 'dim')
    log('', 'reset')
    log('Run: yarn build:setup', 'yellow')
    log('', 'reset')
    rl.close()
    process.exit(1)
  }

  const platformChoice = await question(`${colors.bright}Select [1-3]: ${colors.reset}`)
  const selectedPlatform = platforms.find((p) => p.key === platformChoice)

  if (!selectedPlatform) {
    log('\n✗ Invalid selection', 'red')
    rl.close()
    process.exit(1)
  }

  if (selectedPlatform.requiresMac && !support.ios) {
    log('\n✗ iOS builds require macOS with Xcode installed', 'red')
    rl.close()
    process.exit(1)
  }

  if (selectedPlatform.value === 'android' && !support.android) {
    log('\n✗ Android builds require Android SDK', 'red')
    log('  Run: yarn build:setup', 'yellow')
    rl.close()
    process.exit(1)
  }

  // Step 2: Profile selection
  log('')
  displayProfileMenu()

  const profileChoice = await question(`${colors.bright}Select [1-3]: ${colors.reset}`)
  const selectedProfile = profiles.find((p) => p.key === profileChoice)

  if (!selectedProfile) {
    log('\n✗ Invalid selection', 'red')
    rl.close()
    process.exit(1)
  }

  // Step 3: Release notes (for build:deploy flow only)
  let releaseNotes = null
  if (
    !noDeploy &&
    (selectedProfile.value === 'development' ||
      selectedProfile.value === 'staging' ||
      selectedProfile.value === 'production')
  ) {
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
      log('(Press Enter for default: "Build from {profile} profile")', 'dim')
    }
    log('')

    const releaseNotesInput = await question(`${colors.bright}Release notes: ${colors.reset}`)
    releaseNotes = releaseNotesInput.trim() || `Build from ${selectedProfile.value} profile`
  }

  // Step 4: Confirmation
  log('')
  displayBuildSummary(selectedPlatform, selectedProfile, releaseNotes)

  const confirm = await question(`${colors.bright}Continue with build? (y/n): ${colors.reset}`)

  if (confirm.toLowerCase() !== 'y') {
    log('\n✗ Build cancelled', 'yellow')
    rl.close()
    process.exit(0)
  }

  // Step 5: Build
  displayProgress(selectedPlatform, selectedProfile)

  const outputDir = path.join(process.cwd(), 'build-output')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const keysFileName = `keys.${selectedProfile.value}.json`
  const keysFilePath = path.join(process.cwd(), keysFileName)

  if (!fs.existsSync(keysFilePath)) {
    log('', 'reset')
    log(`⚠ Warning: ${keysFileName} not found`, 'yellow')
    log(`  Using default: keys.development.json`, 'dim')
    log('', 'reset')
  } else {
    log(`✓ Using keys file: ${keysFileName}`, 'green')
    log('', 'reset')
  }

  process.env.KEYSFILE = keysFileName

  log(`📦 Keys file: ${keysFileName}`, 'dim')
  log(`🔧 Profile: ${selectedProfile.value}`, 'dim')
  log('', 'reset')
  log('🔄 Regenerating native code with correct bundle ID...', 'cyan')
  log('')

  const platformsToPrebuild = []
  if (selectedPlatform.value === 'android' || selectedPlatform.value === 'all') {
    platformsToPrebuild.push('android')
  }
  if (selectedPlatform.value === 'ios' || selectedPlatform.value === 'all') {
    platformsToPrebuild.push('ios')
  }

  for (const platform of platformsToPrebuild) {
    log(`  Running expo prebuild for ${platform} (--clean flag will remove existing folders)...`, 'dim')
    const prebuildCommand = `CI=1 KEYSFILE=${keysFileName} npx expo prebuild --platform ${platform} --clean`
    log(`  ${colors.dim}Command: ${prebuildCommand}${colors.reset}`)
    log('')

    try {
      exec(prebuildCommand)
      log(`  ✓ ${platform} native code regenerated`, 'green')
    } catch {
      log('', 'reset')
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red')
      log('  ✗ Prebuild Failed', 'bright')
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red')
      log('')
      log(`Failed to regenerate ${platform} native code.`, 'red')
      log('', 'reset')
      log('Common issues:', 'yellow')
      log('  • Check that keys file exists and is valid JSON', 'dim')
      log('  • Verify bundle ID in keys file matches your requirements', 'dim')
      log(
        '  • Try running manually: KEYSFILE=' + keysFileName + ' npx expo prebuild --platform ' + platform + ' --clean',
        'dim',
      )
      log('')
      rl.close()
      process.exit(1)
    }
    log('')
  }

  log('✓ Native code regeneration complete', 'green')
  log('', 'reset')

  try {
    const buildPlatformSync = (platform) => {
      const buildCommand = [
        'eas build',
        `--platform ${platform}`,
        `--profile ${selectedProfile.value}`,
        '--local',
        '--non-interactive',
      ].join(' ')

      log(`${colors.dim}Command: ${buildCommand}${colors.reset}`)
      log('')

      exec(buildCommand)

      // Move and rename artifacts from root directory to build-output/
      log('', 'reset')
      log(`Moving and renaming ${platform} artifacts to build-output/...`, 'dim')
      moveAndRenameArtifacts(outputDir, selectedProfile.value)
    }

    const buildPlatformAsync = (platform) => {
      return new Promise((resolve, reject) => {
        const buildArgs = [
          'build',
          '--platform',
          platform,
          '--profile',
          selectedProfile.value,
          '--local',
          '--non-interactive',
        ]

        log(`${colors.dim}Command: eas ${buildArgs.join(' ')}${colors.reset}`)
        log('')

        const buildProcess = spawn('eas', buildArgs, {
          stdio: 'inherit',
          shell: false,
        })

        buildProcess.on('close', (code) => {
          if (code === 0) {
            log('', 'reset')
            log(`Moving and renaming ${platform} artifacts to build-output/...`, 'dim')
            moveAndRenameArtifacts(outputDir, selectedProfile.value)
            resolve()
          } else {
            reject(new Error(`${platform} build failed with exit code ${code}`))
          }
        })

        buildProcess.on('error', (error) => {
          reject(new Error(`Failed to start ${platform} build: ${error.message}`))
        })
      })
    }

    if (selectedPlatform.value === 'all') {
      if (selectedProfile.value === 'development') {
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
        log('  Building Android & iOS in parallel...', 'bright')
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
        log('')
        log('💡 Both builds are running simultaneously', 'dim')
        log('💡 Output from both builds will be interleaved', 'dim')
        log('💡 iOS development builds for simulator (no IPA file)', 'dim')
        log('')
      } else {
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
        log('  Building Android & iOS in parallel...', 'bright')
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
        log('')
        log('💡 Both builds are running simultaneously', 'dim')
        log('💡 Output from both builds will be interleaved', 'dim')
        log('')
      }

      await Promise.all([buildPlatformAsync('android'), buildPlatformAsync('ios')])

      log('')
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
      log('  Both builds completed!', 'bright')
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
      log('')
    } else {
      buildPlatformSync(selectedPlatform.value)
    }

    const artifacts = findBuildArtifacts(outputDir, selectedPlatform.value, selectedProfile.value)

    displaySuccess(selectedPlatform, selectedProfile, artifacts)

    // Step 6: Firebase distribution (for build:deploy flow)
    // Skip if --no-deploy flag is passed
    if (
      !noDeploy &&
      (selectedProfile.value === 'development' ||
        selectedProfile.value === 'staging' ||
        selectedProfile.value === 'production') &&
      artifacts.length > 0 &&
      releaseNotes !== null
    ) {
      log('')
      if (selectedProfile.value === 'production') {
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
        log('  Step 6: App Store Submission', 'bright')
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
      } else {
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
        log('  Step 6: Firebase App Distribution', 'bright')
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
      }
      log('')
      log('Deployment Summary:', 'cyan')
      log('')
      log(`  Platform:      ${colors.bright}${selectedPlatform.name}${colors.reset}`)
      log(`  Profile:       ${colors.bright}${selectedProfile.name}${colors.reset}`)
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

      await distributeToFirebase(artifacts, selectedProfile, releaseNotes)
    } else if (
      noDeploy &&
      (selectedProfile.value === 'development' ||
        selectedProfile.value === 'staging' ||
        selectedProfile.value === 'production')
    ) {
      log('ℹ Build complete (deployment skipped)', 'cyan')
      log('', 'reset')
      log('Deploy with:', 'cyan')
      log('  yarn deploy', 'bright')
      log('')
    }

    rl.close()
    process.exit(0)
  } catch (_error) {
    log('')
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red')
    log('  ✗ Build Failed', 'bright')
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'red')
    log('')
    log('Common issues:', 'yellow')
    log('  • Check EAS credentials: eas credentials', 'dim')
    log('  • Verify environment files exist', 'dim')
    log('  • Check build logs above for details', 'dim')
    log('')
    log('Need help?', 'cyan')
    log('  • docs/LOCAL_BUILD_GUIDE.md - Complete guide', 'dim')
    log('  • docs/CI_CD_QUICKSTART.md - Quick troubleshooting', 'dim')
    log('')
    rl.close()
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(`\n${colors.red}Error:${colors.reset}`, error.message)
  rl.close()
  process.exit(1)
})
