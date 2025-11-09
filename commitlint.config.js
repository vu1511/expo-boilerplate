module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only
        'style', // Code style (formatting, missing semi-colons, etc)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf', // Performance improvement
        'test', // Adding tests
        'chore', // Changes to build process or auxiliary tools
        'revert', // Reverts a previous commit
        'ci', // CI/CD changes
        'build' // Build system changes
      ]
    ],
    'subject-case': [0], // Allow any case for subject
    'scope-case': [0] // Allow any case for scope
  }
}
