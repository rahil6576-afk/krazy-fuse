const fs = require('fs');
const path = require('path');

/**
 * Loads key-value pairs from .env into process.env if not already present.
 */
function loadEnv(envFilePath = path.join(__dirname, '.env')) {
    if (fs.existsSync(envFilePath)) {
        try {
            const raw = fs.readFileSync(envFilePath, 'utf8');
            const lines = raw.split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) continue;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx !== -1) {
                    const key = trimmed.slice(0, eqIdx).trim();
                    let val = trimmed.slice(eqIdx + 1).trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    if (process.env[key] === undefined) {
                        process.env[key] = val;
                    }
                }
            }
        } catch (err) {
            console.warn('⚠️ Could not read .env file:', err.message);
        }
    }
}

/**
 * Returns a browser-executable JS string initializing window.KRAZY_SUPABASE_CONFIG
 */
function generateConfigJs() {
    loadEnv();
    const url = (process.env.SUPABASE_URL || '').trim();
    const anonKey = (process.env.SUPABASE_ANON_KEY || '').trim();

    return `/**\n` +
        ` * Krazy Fuse — Supabase Backend Configuration\n` +
        ` * Generated dynamically from environment variables (.env)\n` +
        ` */\n` +
        `window.KRAZY_SUPABASE_CONFIG = {\n` +
        `    url: ${JSON.stringify(url)},\n` +
        `    anonKey: ${JSON.stringify(anonKey)}\n` +
        `};\n`;
}

module.exports = {
    loadEnv,
    generateConfigJs
};
