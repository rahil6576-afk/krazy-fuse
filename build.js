const fs = require('fs');
const path = require('path');
const { loadEnv, generateConfigJs } = require('./load-env');

// Load environment variables (.env or process.env from deployment environment like Vercel)
loadEnv();

const dist = path.join(__dirname, 'dist');
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

const itemsToCopy = [
  'index.html',
  'portal.css',
  'portal.js',
  'supabase-client.js',
  'supabase-schema.sql',
  'krazio-icon.svg',
  'krazio-logo.svg',
  'krazio-mascot.svg',
  'krazio-icon-day.svg',
  'krazio-logo-day.svg',
  'krazio-mascot-day.svg',
  'krazio-logo.png',
  'krazio-mascot.png',
  'office-escape',
  'elevator-doom',
  'popup-game',
  'fallen-one',
  'gravity-flip',
  'wild-swings',
  'dart-board',
  'flappy-man',
  'bomb-panic',
  'tic-tac-toe',
  'chess',
  'assets',
  'public',
  'thumbnails',
  'src',
  'audio',
  'game-manifests.json'
];

for (const item of itemsToCopy) {
  const src = path.join(__dirname, item);
  const dest = path.join(dist, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
}

// Generate dynamic supabase-config.js into dist from environment variables
const dynamicConfig = generateConfigJs();
fs.writeFileSync(path.join(dist, 'supabase-config.js'), dynamicConfig, 'utf8');

// Also sync root supabase-config.js with current active env for local preview
fs.writeFileSync(path.join(__dirname, 'supabase-config.js'), dynamicConfig, 'utf8');

console.log('Successfully built arcade distribution into /dist with dynamic environment configuration.');

