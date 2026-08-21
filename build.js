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
  'krazio-icon.svg',
  'krazio-logo.svg',
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
  'assets'
];

// If popup dist exists, ensure latest build is copied to popup-game
const popupDist = path.join(__dirname, 'popup', 'dist');
const popupGame = path.join(__dirname, 'popup-game');
if (fs.existsSync(popupDist)) {
  fs.cpSync(popupDist, popupGame, { recursive: true });
}

for (const item of itemsToCopy) {
  const src = path.join(__dirname, item);
  const dest = path.join(dist, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
}

console.log('Successfully built static arcade distribution into /dist');
