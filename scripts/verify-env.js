#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * Script to verify react-native-keys setup
 * Run: node scripts/verify-env.js
 */

const fs = require('fs')
const path = require('path')

const KEYS_FILE = path.join(__dirname, '..', 'keys.development.json')
const KEYS_EXAMPLE_FILE = path.join(__dirname, '..', 'keys.example.json')

console.log('🔍 Verifying react-native-keys setup...\n')

// Check if keys.development.json file exists
if (!fs.existsSync(KEYS_FILE)) {
  console.error('❌ keys.development.json file not found!')
  console.log('\n💡 Run: yarn env:setup (or cp keys.example.json keys.development.json)')
  process.exit(1)
}

console.log('✅ keys.development.json file exists')

// Read both files
let keysData
let exampleData

try {
  keysData = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'))
  console.log('✅ keys.development.json is valid JSON')
} catch (error) {
  console.error('❌ keys.development.json is not valid JSON!')
  console.error(error.message)
  process.exit(1)
}

try {
  exampleData = JSON.parse(fs.readFileSync(KEYS_EXAMPLE_FILE, 'utf-8'))
} catch (error) {
  console.error('❌ keys.example.json is not valid JSON!')
  console.error(error.message)
  process.exit(1)
}

// Check for correct structure (public and secure objects)
if (!keysData.public || !keysData.secure) {
  console.error('\n❌ Invalid structure! Keys file must have "public" and "secure" objects')
  console.log('\n📖 Expected structure:')
  console.log('   {')
  console.log('     "public": { ... },')
  console.log('     "secure": { ... }')
  console.log('   }')
  console.log('\n💡 See docs/KEYS-STRUCTURE.md for details')
  process.exit(1)
}

// Check for missing public keys
const missingPublicKeys = Object.keys(exampleData.public || {}).filter((key) => !(key in keysData.public))

// Check for missing secure keys
const missingSecureKeys = Object.keys(exampleData.secure || {}).filter((key) => !(key in keysData.secure))

if (missingPublicKeys.length > 0) {
  console.warn('\n⚠️  Missing public keys:')
  missingPublicKeys.forEach((key) => {
    console.warn(`   - public.${key}`)
  })
}

if (missingSecureKeys.length > 0) {
  console.warn('\n⚠️  Missing secure keys:')
  missingSecureKeys.forEach((key) => {
    console.warn(`   - secure.${key}`)
  })
}

if (missingPublicKeys.length === 0 && missingSecureKeys.length === 0) {
  console.log('✅ All required keys are present')
  console.log(`   - ${Object.keys(keysData.public).length} public keys`)
  console.log(`   - ${Object.keys(keysData.secure).length} secure keys`)
} else {
  console.log('\n💡 Check keys.example.json for reference')
}

// Check for placeholder values
const placeholders = ['your-api-key-here', 'your-value-here', 'example.com']

const hasPlaceholders = Object.values(keysData).some((value) => {
  return placeholders.some((placeholder) => String(value).includes(placeholder))
})

if (hasPlaceholders) {
  console.warn('\n⚠️  Some keys may contain placeholder values')
  console.log('   Please update them with actual values before deployment')
}

console.log('\n✨ Environment verification complete!\n')

// Additional notes
console.log('📝 Notes:')
console.log('   - Keys are loaded via react-native-keys')
console.log('   - After changing keys.development.json, run: expo prebuild --clean')
console.log('   - Use KEYSFILE env var to switch environments')
console.log('   - See docs/CONFIGURATION.md for more info')
console.log('')
