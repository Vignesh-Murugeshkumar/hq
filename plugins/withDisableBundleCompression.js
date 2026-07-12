const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Config plugin to comment out `enableBundleCompression` in `android/app/build.gradle`.
 * This fixes the error: "Could not set unknown property 'enableBundleCompression' for extension 'react'"
 * when building with React Native versions that do not support this property.
 */
function withDisableBundleCompression(config) {
  return withAppBuildGradle(config, (configMod) => {
    if (configMod.modResults.language === 'groovy') {
      configMod.modResults.contents = configMod.modResults.contents.replace(
        /enableBundleCompression\s*=\s*.*/g,
        "// enableBundleCompression = (findProperty('android.enableBundleCompression') ?: false).toBoolean() // Commented out to support current React Native version"
      );
    }
    return configMod;
  });
}

module.exports = withDisableBundleCompression;
