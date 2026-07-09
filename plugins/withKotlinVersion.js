const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Config plugin to inject the kotlinVersion property into gradle.properties during expo prebuild.
 * This resolves the Gradle evaluation crash where third-party plugins reference $kotlinVersion
 * but the variable is not defined in Gradle's buildscript properties.
 */
function withKotlinVersion(config, kotlinVersion = '2.0.21') {
  return withGradleProperties(config, (configMod) => {
    const properties = configMod.modResults;
    
    // Check if the property already exists to avoid duplication
    const index = properties.findIndex((p) => p.key === 'kotlinVersion');
    if (index > -1) {
      properties[index].value = kotlinVersion;
    } else {
      properties.push({
        type: 'property',
        key: 'kotlinVersion',
        value: kotlinVersion,
      });
    }
    return configMod;
  });
}

module.exports = withKotlinVersion;
