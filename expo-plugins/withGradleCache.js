const { withGradleProperties } = require('@expo/config-plugins')

/**
 * Expo config plugin to enable Gradle build cache
 * This ensures org.gradle.caching=true is set in gradle.properties
 * even after expo prebuild regenerates the native folders
 */
const withGradleCache = (config) => {
  return withGradleProperties(config, (config) => {
    const existingProperty = config.modResults.find(
      (item) => item.type === 'property' && item.key === 'org.gradle.caching',
    )

    if (existingProperty) {
      existingProperty.value = 'true'
    } else {
      config.modResults.push({
        type: 'property',
        key: 'org.gradle.caching',
        value: 'true',
      })
    }

    return config
  })
}

module.exports = withGradleCache
