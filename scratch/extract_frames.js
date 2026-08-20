const { execFile } = require('child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const videoPath = "C:\\Users\\RAHIL SUTARIA\\.gemini\\antigravity-ide\\brain\\893b5003-f59f-459d-a95c-0b1dca87cfe0\\ref_video.mov";
const outPattern = "C:\\Users\\RAHIL SUTARIA\\.gemini\\antigravity-ide\\brain\\893b5003-f59f-459d-a95c-0b1dca87cfe0\\ref_frame_%02d.png";

const args = [
    '-i', videoPath,
    '-vf', 'fps=0.5',
    outPattern
];

console.log('Running ffmpeg from:', ffmpegPath);
execFile(ffmpegPath, args, (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error);
        console.error('Stderr:', stderr);
    } else {
        console.log('Frames extracted successfully!');
    }
});
