#!/usr/bin/env node

/**
 * Interactive Release Script
 * Prompts user to select release type and executes standard-version
 */

const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Colors for terminal output
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

console.log(`\n${colors.bright}${colors.blue}🚀 Release Preparation${colors.reset}\n`)

const options = [
  {
    key: '1',
    name: 'Auto-detect',
    description: 'Analyze commits and determine version automatically',
    command: 'standard-version',
  },
  {
    key: '2',
    name: 'Patch',
    description: 'Bug fixes only (1.0.0 → 1.0.1)',
    command: 'standard-version --release-as patch',
  },
  {
    key: '3',
    name: 'Minor',
    description: 'New features (1.0.0 → 1.1.0)',
    command: 'standard-version --release-as minor',
  },
  {
    key: '4',
    name: 'Major',
    description: 'Breaking changes (1.0.0 → 2.0.0)',
    command: 'standard-version --release-as major',
  },
  {
    key: '5',
    name: 'First Release',
    description: 'Initial release (creates CHANGELOG without version bump)',
    command: 'standard-version --first-release',
  },
  {
    key: '6',
    name: 'Dry Run',
    description: 'Preview changes without making any commits',
    command: 'standard-version --dry-run',
  },
  {
    key: '7',
    name: 'Custom Version',
    description: 'Manually specify version number (e.g., 1.5.0, 2.3.1)',
    command: null, // Will be set dynamically
  },
]

// Display options
console.log('Select release type:\n')
options.forEach((option) => {
  console.log(
    `  ${colors.bright}${colors.cyan}${option.key}${colors.reset}. ${colors.bright}${option.name}${colors.reset}`,
  )
  console.log(`     ${colors.dim}${option.description}${colors.reset}\n`)
})

// Get current version
let currentVersion = '1.0.0'
try {
  const packageJson = require('../package.json')
  currentVersion = packageJson.version
} catch (error) {
  // Ignore if can't read package.json
}

console.log(`${colors.dim}Current version: ${currentVersion}${colors.reset}\n`)

rl.question(`${colors.bright}Choose an option (1-7) [default: 1]: ${colors.reset}`, (answer) => {
  const selection = answer.trim() || '1'
  const option = options.find((opt) => opt.key === selection)

  if (!option) {
    console.log(`\n${colors.red}✗ Invalid selection${colors.reset}\n`)
    rl.close()
    process.exit(1)
  }

  // Handle custom version input
  if (option.key === '7') {
    rl.question(`${colors.bright}Enter version number (e.g., 1.5.0, 2.3.1): ${colors.reset}`, (versionInput) => {
      rl.close()

      const customVersion = versionInput.trim()

      // Validate version format (basic check)
      if (!/^\d+\.\d+\.\d+/.test(customVersion)) {
        console.log(`\n${colors.red}✗ Invalid version format. Use semantic versioning (e.g., 1.5.0)${colors.reset}\n`)
        process.exit(1)
      }

      console.log(`\n${colors.green}▶ Running: Custom Version → ${customVersion}${colors.reset}`)
      console.log(`${colors.dim}Command: standard-version --release-as ${customVersion}${colors.reset}\n`)

      try {
        execSync(`standard-version --release-as ${customVersion}`, { stdio: 'inherit' })

        console.log(`\n${colors.bright}${colors.green}✓ Release complete!${colors.reset}\n`)
        console.log('Next steps:')
        console.log(`  ${colors.cyan}1.${colors.reset} Review CHANGELOG.md`)
        console.log(
          `  ${colors.cyan}2.${colors.reset} Push: ${colors.dim}git push --follow-tags origin main${colors.reset}`,
        )
        console.log(
          `  ${colors.cyan}3.${colors.reset} Build: ${colors.dim}yarn prebuild:production && eas build --platform all${colors.reset}\n`,
        )
      } catch (error) {
        console.log(`\n${colors.red}✗ Release failed${colors.reset}\n`)
        process.exit(1)
      }
    })
    return
  }

  // Handle all other options
  rl.close()

  console.log(`\n${colors.green}▶ Running: ${option.name}${colors.reset}`)
  console.log(`${colors.dim}Command: ${option.command}${colors.reset}\n`)

  try {
    execSync(option.command, { stdio: 'inherit' })

    // If not dry run, show next steps
    if (!option.command.includes('--dry-run')) {
      console.log(`\n${colors.bright}${colors.green}✓ Release complete!${colors.reset}\n`)
      console.log('Next steps:')
      console.log(`  ${colors.cyan}1.${colors.reset} Review CHANGELOG.md`)
      console.log(
        `  ${colors.cyan}2.${colors.reset} Push: ${colors.dim}git push --follow-tags origin main${colors.reset}`,
      )
      console.log(
        `  ${colors.cyan}3.${colors.reset} Build: ${colors.dim}yarn prebuild:production && eas build --platform all${colors.reset}\n`,
      )
    }
  } catch (error) {
    console.log(`\n${colors.red}✗ Release failed${colors.reset}\n`)
    process.exit(1)
  }
})
