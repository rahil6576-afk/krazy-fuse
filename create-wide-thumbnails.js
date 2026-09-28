const sharp = require('./fallen-one/node_modules/sharp');
const path = require('path');
const fs = require('fs');

async function createWideThumbnails() {
    const bentoDir = path.join(__dirname, 'public', 'thumbnails', 'bento');
    const rootBentoDir = path.join(__dirname, 'thumbnails', 'bento');

    // 1. Office Escape wide (800x450, 16:9)
    await sharp(path.join(__dirname, 'thumbnails', 'office-escape.jpg'))
        .resize(800, 450, { fit: 'cover', position: 'center' })
        .webp({ quality: 92 })
        .toFile(path.join(bentoDir, 'office-escape-wide.webp'));
    fs.copyFileSync(path.join(bentoDir, 'office-escape-wide.webp'), path.join(rootBentoDir, 'office-escape-wide.webp'));
    console.log('✓ office-escape-wide.webp created');

    // 2. Cyber Clash (Fallen One) wide (800x450, 16:9)
    await sharp(path.join(__dirname, 'thumbnails', 'fallen-one.jpg'))
        .resize(800, 450, { fit: 'cover', position: 'center' })
        .webp({ quality: 92 })
        .toFile(path.join(bentoDir, 'fallen-one-wide.webp'));
    fs.copyFileSync(path.join(bentoDir, 'fallen-one-wide.webp'), path.join(rootBentoDir, 'fallen-one-wide.webp'));
    console.log('✓ fallen-one-wide.webp created');
}

createWideThumbnails().catch(console.error);
