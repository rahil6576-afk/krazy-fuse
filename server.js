const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.webm': 'video/webm',
    '.mp4': 'video/mp4',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].split('#')[0];
    try {
        cleanUrl = decodeURIComponent(cleanUrl);
    } catch (e) {}

    let filePath = path.join(PUBLIC_DIR, cleanUrl);

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            if (!cleanUrl.endsWith('/')) {
                const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
                res.writeHead(301, { 'Location': cleanUrl + '/' + query });
                res.end();
                return;
            }
            filePath = path.join(filePath, 'index.html');
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                // If not found at direct path, try dist/
                let distPath = path.join(PUBLIC_DIR, 'dist', cleanUrl);
                fs.stat(distPath, (dStatErr, dStats) => {
                    if (!dStatErr && dStats.isDirectory()) {
                        if (!cleanUrl.endsWith('/')) {
                            const query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
                            res.writeHead(301, { 'Location': cleanUrl + '/' + query });
                            res.end();
                            return;
                        }
                        distPath = path.join(distPath, 'index.html');
                    }

                    fs.readFile(distPath, (distErr, distData) => {
                        if (distErr) {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('404 Not Found');
                        } else {
                            const ext = path.extname(distPath).toLowerCase();
                            res.writeHead(200, {
                                'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
                                'Access-Control-Allow-Origin': '*'
                            });
                            res.end(distData);
                        }
                    });
                });
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            res.writeHead(200, {
                'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(data);
        });
    });
});

function startServer(port) {
    server.removeAllListeners('error');
    server.removeAllListeners('listening');

    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is already in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });

    server.listen(port, () => {
        const url = `http://localhost:${port}`;
        console.log(`\n⚡ Krazio Games Local Server is live at: ${url}`);
        console.log(`🚀 Opening Google Chrome...\n`);

        // Open Chrome automatically AFTER the server is ready
        if (process.platform === 'win32') {
            exec(`start chrome ${url}`);
        } else if (process.platform === 'darwin') {
            exec(`open -a "Google Chrome" ${url} || open ${url}`);
        } else {
            exec(`google-chrome ${url} || xdg-open ${url}`);
        }
    });
}

startServer(Number(PORT));

