const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

const itemsToCopy = [
  'index.html',
  'portal.css',
  'portal.js',
  'supabase-config.js',
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

console.log('Successfully built static arcade distribution into /dist');
