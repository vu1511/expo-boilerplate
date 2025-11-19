/**
 * Shared Firebase App Distribution Core Logic
 *
 * This module contains the core Firebase deployment logic
 * that can be reused by both build-local.js and deploy.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

/**
 * Check if Firebase CLI is installed
 */
function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * Check if user is logged in to Firebase
 */
function checkFirebaseLogin() {
  try {
    const result = execSync('firebase projects:list', { stdio: 'pipe', encoding: 'utf8' })
    return result.includes('│')
  } catch {
    return false
  }
}

/**
 * Read Firebase App IDs and testers from keys file
 */
function readFirebaseAppIds(keysFilePath) {
  try {
    if (!fs.existsSync(keysFilePath)) {
      return {
        android: process.env.FIREBASE_ANDROID_APP_ID,
        ios: process.env.FIREBASE_IOS_APP_ID,
        group: process.env.FIREBASE_GROUP,
      }
    }

    const keysData = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'))
    return {
      android: keysData.public?.FIREBASE_ANDROID_APP_ID || process.env.FIREBASE_ANDROID_APP_ID,
      ios: keysData.public?.FIREBASE_IOS_APP_ID || process.env.FIREBASE_IOS_APP_ID,
      group: keysData.public?.FIREBASE_GROUP || process.env.FIREBASE_GROUP,
    }
  } catch {
    return {
      android: process.env.FIREBASE_ANDROID_APP_ID,
      ios: process.env.FIREBASE_IOS_APP_ID,
      group: process.env.FIREBASE_GROUP,
    }
  }
}

/**
 * Deploy artifacts to Firebase App Distribution for development and staging, App Store and Play Store for production
 *
 * @param {Array} artifacts - Array of artifact objects with {path, platform, type}
 * @param {string} profile - Build profile (development, staging, production)
 * @param {Object} options - Options object with {log, question, colors, keysFilePath, nonInteractive, releaseNotes}
 * @returns {Promise<{success: boolean, successCount: number, failCount: number}>}
 */
async function deploy(artifacts, profile, options = {}) {
  if (profile === 'production') {
    return await submitToStores(artifacts, profile, options)
  }

  return await deployToFirebase(artifacts, profile, options)
}

/**
 * Submit production builds to App Store and Play Store using EAS Submit
 */
async function submitToStores(artifacts, profile, options) {
  const { log, releaseNotes = null } = options

  log('')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  📤 Submitting to App Stores', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('')

  let successCount = 0
  let failCount = 0

  for (const artifact of artifacts) {
    const fileName = path.basename(artifact.path)
    const storeName = artifact.platform === 'android' ? 'Google Play Store' : 'App Store'

    log(`📱 Submitting ${fileName} to ${storeName}...`, 'cyan')
    log('')

    try {
      const submitCmd = `npx eas submit --platform ${artifact.platform} --path "${artifact.path}" --profile ${profile} --non-interactive`

      // Note: Release notes are not supported via CLI for any platform
      // iOS: --what-to-test requires Enterprise plan
      // Android: Not supported by EAS Submit
      if (releaseNotes) {
        log(`  📝 Release notes: ${releaseNotes}`, 'dim')
        if (artifact.platform === 'ios') {
          log(`  ⚠️  iOS release notes must be added manually in App Store Connect`, 'yellow')
          log(`     --what-to-test flag requires Enterprise plan (not available on your tier)`, 'dim')
        } else {
          log(`  ⚠️  Android release notes must be added manually in Google Play Console`, 'yellow')
          log(`     EAS Submit does not support Android release notes via CLI or eas.json`, 'dim')
        }
      }

      log(`  Command: ${submitCmd}`, 'dim')
      log('')

      execSync(submitCmd, { stdio: 'inherit' })

      log('')
      log(`  ✓ ${fileName} submitted to ${storeName} successfully`, 'green')
      successCount++
    } catch {
      log('')
      log(`  ✗ Failed to submit ${fileName} to ${storeName}`, 'red')
      log('')
      log('  Common issues:', 'yellow')

      if (artifact.platform === 'android') {
        log('    • Service account key not configured in Expo dashboard', 'dim')
        log('    • App not created in Google Play Console', 'dim')
        log('    • Package name mismatch', 'dim')
        log('', 'reset')
        log('  Setup guide:', 'cyan')
        log('    https://docs.expo.dev/submit/android/', 'dim')
      } else {
        log('    • App Store Connect API key not configured in Expo dashboard', 'dim')
        log('    • App not created in App Store Connect', 'dim')
        log('    • Bundle identifier mismatch', 'dim')
        log('    • Provisioning profile issues', 'dim')
        log('', 'reset')
        log('  Setup guide:', 'cyan')
        log('    https://docs.expo.dev/submit/ios/', 'dim')
      }

      failCount++
    }

    log('')
  }

  // Summary
  if (successCount > 0) {
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
    log(`  ✅ ${successCount} artifact(s) submitted to stores!`, 'bright')
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
    log('')
    log('⏱  Store review times:', 'dim')
    log('   • App Store: 24-48 hours (typical)', 'dim')
    log('   • Google Play: 1-3 days (typical)', 'dim')
    log('')
    log('🔗 Track submission status:', 'cyan')
    log('   https://expo.dev/accounts/[account]/projects/[project]/submissions', 'dim')
    log('')
  }

  if (failCount > 0) {
    log(`⚠ ${failCount} artifact(s) failed to submit`, 'yellow')
    log('')
  }

  return {
    success: successCount > 0,
    successCount,
    failCount,
  }
}

/**
 * Deploy to Firebase App Distribution (for development and staging)
 */
async function deployToFirebase(artifacts, profile, options) {
  const { log, question, keysFilePath, nonInteractive = false, releaseNotes = null } = options

  if (!checkFirebaseCLI()) {
    log('⚠ Firebase CLI not installed', 'yellow')
    log('', 'reset')
    log('Install with:', 'dim')
    log('  npm install -g firebase-tools', 'cyan')
    log('', 'reset')

    if (nonInteractive) {
      log('✗ Cannot install Firebase CLI in non-interactive mode', 'red')
      return { success: false, successCount: 0, failCount: 0 }
    }

    const install = await question('Install now? (y/n): ')

    if (install.toLowerCase() === 'y') {
      try {
        log('Installing Firebase CLI...', 'dim')
        execSync('npm install -g firebase-tools', { stdio: 'inherit' })
        log('✓ Firebase CLI installed', 'green')
      } catch {
        log('✗ Failed to install Firebase CLI', 'red')
        return { success: false, successCount: 0, failCount: 0 }
      }
    } else {
      log('Skipping Firebase distribution', 'dim')
      return { success: false, successCount: 0, failCount: 0 }
    }
  }

  if (!checkFirebaseLogin()) {
    log('⚠ Not logged in to Firebase', 'yellow')
    log('', 'reset')

    if (nonInteractive) {
      log('✗ Cannot login to Firebase in non-interactive mode', 'red')
      return { success: false, successCount: 0, failCount: 0 }
    }

    const login = await question('Login now? (y/n): ')

    if (login.toLowerCase() === 'y') {
      try {
        log('Opening browser for Firebase login...', 'dim')
        execSync('firebase login', { stdio: 'inherit' })
      } catch {
        log('✗ Failed to login to Firebase', 'red')
        return { success: false, successCount: 0, failCount: 0 }
      }
    } else {
      log('Skipping Firebase distribution', 'dim')
      return { success: false, successCount: 0, failCount: 0 }
    }
  }

  if (keysFilePath) {
    log(`🔑 Reading Firebase App IDs from: ${path.basename(keysFilePath)}`, 'dim')
  } else {
    log(`🔑 No keys file specified, using environment variables`, 'dim')
  }
  log('')

  const appIds = readFirebaseAppIds(keysFilePath)

  log(`📱 Firebase Android App ID: ${appIds.android ? '✓' : '✗ Not found'}`, 'dim')
  log(`📱 Firebase iOS App ID: ${appIds.ios ? '✓' : '✗ Not found'}`, 'dim')
  log('')

  let notes
  if (nonInteractive && releaseNotes) {
    notes = releaseNotes
    log(`📝 Using release notes: ${notes}`, 'dim')
  } else {
    log('Enter release notes (press Enter for default):', 'cyan')
    const releaseNotesInput = await question('> ')
    notes = releaseNotesInput.trim() || `Build from ${profile} profile`
  }

  log('')
  log('Uploading to Firebase App Distribution...', 'cyan')
  log('')

  let successCount = 0
  let failCount = 0

  for (const artifact of artifacts) {
    const fileName = path.basename(artifact.path)
    log(`  Uploading ${fileName}...`, 'dim')

    try {
      const appId = artifact.platform === 'android' ? appIds.android : appIds.ios

      if (!appId) {
        log(`  ⚠ Firebase App ID not found for ${artifact.platform}, skipping ${fileName}`, 'yellow')
        log(`    Add FIREBASE_${artifact.platform.toUpperCase()}_APP_ID to keys.${profile}.json`, 'dim')
        failCount++
        continue
      }

      log(`  Using Firebase App ID: ${appId}`, 'dim')

      const firebaseCmdParts = [
        'firebase appdistribution:distribute',
        `"${artifact.path}"`,
        `--app ${appId}`,
        `--release-notes "${notes}"`,
        `--groups "${appIds.group ?? 'testers'}"`,
      ]

      const firebaseCmd = firebaseCmdParts.join(' ')

      execSync(firebaseCmd, { stdio: 'inherit' })
      log(`  ✓ ${fileName} uploaded successfully`, 'green')
      successCount++
    } catch (error) {
      log(`  ✗ Failed to upload ${fileName}`, 'red')

      if (error.message && error.message.includes('does not match')) {
        log(``, 'reset')
        log(`  💡 This APK was built with the wrong package name!`, 'yellow')
        log(`     The build used keys.example.json instead of keys.${profile}.json`, 'dim')
        log(``, 'reset')
        log(`  🔧 Fix: Rebuild with correct keys file:`, 'cyan')
        log(`     1. Delete the old APK: rm build-output/${fileName}`, 'dim')
        log(`     2. Clear EAS cache: rm -rf ~/.eas-build-local`, 'dim')
        log(`     3. Rebuild: yarn build`, 'dim')
        log(``, 'reset')
      }

      failCount++
    }

    log('')
  }

  if (successCount > 0) {
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
    log(`  ✅ ${successCount} artifact(s) uploaded to Firebase!`, 'bright')
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green')
    log('')
    log('📱 Testers will be notified via email', 'dim')
    log('🔗 View in Firebase Console:', 'dim')
    log('   https://console.firebase.google.com/project/_/appdistribution', 'cyan')
    log('')
  }

  if (failCount > 0) {
    log(`⚠ ${failCount} artifact(s) failed to upload`, 'yellow')
    log('', 'reset')
    log('Common issues:', 'dim')
    log('  • Firebase App IDs not in keys.*.json file', 'dim')
    log('  • Testers group "testers" does not exist in Firebase Console', 'dim')
    log('  • App not configured in Firebase App Distribution', 'dim')
    log('  • Not logged in to Firebase (run: firebase login)', 'dim')
    log('', 'reset')
    log('Setup guide:', 'cyan')
    log('  docs/FIREBASE_DISTRIBUTION.md', 'dim')
    log('', 'reset')
  }

  return {
    success: successCount > 0,
    successCount,
    failCount,
  }
}

module.exports = {
  checkFirebaseCLI,
  checkFirebaseLogin,
  readFirebaseAppIds,
  deploy,
}
