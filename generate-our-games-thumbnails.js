const sharp = require('./fallen-one/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const OUR_GAMES = [
    { id: 'office-escape', file: 'office-escape.jpg' },
    { id: 'dart-board', file: 'dart-board.jpg' },
    { id: 'elevator-doom', file: 'elevator-doom.jpg' },
    { id: 'bomb-panic', file: 'bomb-panic.jpg' },
    { id: 'flappy-man', file: 'flappy-man.jpg' },
    { id: 'wild-swings', file: 'wild-swings.jpg' },
    { id: 'fallen-one', file: 'fallen-one.jpg' },
    { id: 'gravity-flip', file: 'gravity-flip.jpg' },
    { id: 'pop-up', file: 'pop-up.jpg' },
    { id: 'tic-tac-toe', file: 'tic-tac-toe.jpg' }
];

async function generateOurGameThumbnails() {
    const bentoDir = path.join(__dirname, 'public', 'thumbnails', 'bento');
    const rootBentoDir = path.join(__dirname, 'thumbnails', 'bento');
    if (!fs.existsSync(bentoDir)) fs.mkdirSync(bentoDir, { recursive: true });
    if (!fs.existsSync(rootBentoDir)) fs.mkdirSync(rootBentoDir, { recursive: true });

    for (const g of OUR_GAMES) {
        const srcPath = path.join(__dirname, 'thumbnails', g.file);
        if (fs.existsSync(srcPath)) {
            const destPath = path.join(bentoDir, `${g.id}.webp`);
            const rootDestPath = path.join(rootBentoDir, `${g.id}.webp`);

            // Crop to square 400x400 center
            await sharp(srcPath)
                .resize(400, 400, { fit: 'cover', position: 'center' })
                .webp({ quality: 92 })
                .toFile(destPath);

            fs.copyFileSync(destPath, rootDestPath);
            console.log(`✓ Generated ${g.id}.webp (400x400 square)`);
        } else {
            console.warn(`File not found: ${srcPath}`);
        }
    }
}

generateOurGameThumbnails().catch(console.error);
