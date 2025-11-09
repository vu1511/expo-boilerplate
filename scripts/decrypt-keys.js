#!/usr/bin/env node

/**
 * Decrypt Environment Keys Script
 * 
 * This script decrypts environment-specific keys for use in CI/CD pipelines.
 * It's designed to be called from GitHub Actions workflows.
 * 
 * Usage:
 *   node scripts/decrypt-keys.js <environment>
 *   
 * Example:
 *   GPG_PASSPHRASE="your-secret" node scripts/decrypt-keys.js staging
 * 
 * This will decrypt config/encrypted/keys.staging.json.gpg
 * and output to keys.staging.json
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

// Get environment from command line argument
const environment = process.argv[2]

if (!environment) {
  console.error(`${colors.red}❌ Error: Environment not specified${colors.reset}`)
  console.error(`\nUsage: node scripts/decrypt-keys.js <environment>`)
  console.error(`Example: node scripts/decrypt-keys.js staging`)
  console.error(`\nAvailable environments: development, staging, production`)
  process.exit(1)
}

// Validate environment
const validEnvironments = ['development', 'staging', 'production']
if (!validEnvironments.includes(environment)) {
  console.error(`${colors.red}❌ Error: Invalid environment '${environment}'${colors.reset}`)
  console.error(`\nValid environments: ${validEnvironments.join(', ')}`)
  process.exit(1)
}

// Check if GPG_PASSPHRASE is set
const passphrase = process.env.GPG_PASSPHRASE
if (!passphrase) {
  console.error(`${colors.red}❌ Error: GPG_PASSPHRASE environment variable not set${colors.reset}`)
  console.error(`\nSet it before running this script:`)
  console.error(`  export GPG_PASSPHRASE="your-secret-passphrase"`)
  console.error(`  node scripts/decrypt-keys.js ${environment}`)
  process.exit(1)
}

// Paths
const encryptedFile = path.join(__dirname, '..', 'config', 'encrypted', `keys.${environment}.json.gpg`)
const outputFile = path.join(__dirname, '..', `keys.${environment}.json`)

// Check if encrypted file exists
if (!fs.existsSync(encryptedFile)) {
  console.error(`${colors.red}❌ Error: Encrypted file not found${colors.reset}`)
  console.error(`\nExpected file: ${encryptedFile}`)
  console.error(`\nMake sure you have encrypted the keys first:`)
  console.error(`  yarn env:encrypt ${environment}`)
  process.exit(1)
}

console.log(`${colors.bright}${colors.blue}🔓 Decrypting Keys${colors.reset}\n`)
console.log(`Environment: ${colors.cyan}${environment}${colors.reset}`)
console.log(`Source:      ${colors.cyan}${encryptedFile}${colors.reset}`)
console.log(`Output:      ${colors.cyan}${outputFile}${colors.reset}\n`)

try {
  // Decrypt using GPG
  execSync(
    `gpg --quiet --batch --yes --decrypt --passphrase="${passphrase}" --output "${outputFile}" "${encryptedFile}"`,
    { stdio: 'inherit' }
  )

  // Verify the output file exists and is valid JSON
  if (!fs.existsSync(outputFile)) {
    throw new Error('Decryption failed: Output file not created')
  }

  const decryptedContent = fs.readFileSync(outputFile, 'utf-8')
  JSON.parse(decryptedContent) // Validate JSON

  console.log(`\n${colors.green}✅ Successfully decrypted keys for ${environment}${colors.reset}`)
  console.log(`\nOutput file: ${outputFile}`)
} catch (error) {
  console.error(`\n${colors.red}❌ Decryption failed${colors.reset}`)
  console.error(`\nError: ${error.message}`)
  console.error(`\nPossible causes:`)
  console.error(`  - Incorrect GPG_PASSPHRASE`)
  console.error(`  - Corrupted encrypted file`)
  console.error(`  - GPG not installed`)
  process.exit(1)
}

