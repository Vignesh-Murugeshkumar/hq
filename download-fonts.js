const fs = require('fs');
const path = require('path');
const https = require('https');

const fontsDir = path.join(__dirname, 'assets', 'fonts');

// Create directory if it doesn't exist
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fonts = [
  { name: 'Nunito-Regular.ttf', url: 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/nunito/Nunito_400Regular.ttf' },
  { name: 'Nunito-Medium.ttf', url: 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/nunito/Nunito_500Medium.ttf' },
  { name: 'Nunito-SemiBold.ttf', url: 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/nunito/Nunito_600SemiBold.ttf' },
  { name: 'Nunito-Bold.ttf', url: 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/nunito/Nunito_700Bold.ttf' },
  { name: 'Nunito-ExtraBold.ttf', url: 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/nunito/Nunito_800ExtraBold.ttf' }
];

function downloadFont(font) {
  return new Promise((resolve, reject) => {
    const dest = path.join(fontsDir, font.name);
    const file = fs.createWriteStream(dest);
    
    https.get(font.url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${font.name}: status code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded: ${font.name}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Downloading Nunito fonts to assets/fonts...');
  try {
    for (const font of fonts) {
      await downloadFont(font);
    }
    console.log('All fonts downloaded successfully!');
  } catch (err) {
    console.error('Error downloading fonts:', err);
    process.exit(1);
  }
}

downloadAll();
