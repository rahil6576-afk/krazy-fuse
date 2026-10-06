import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

let errors = 0;
let checked = 0;

function walk(d) {
  const list = fs.readdirSync(d);
  for (const f of list) {
    if (f === 'node_modules' || f === '.git' || f === 'dist') continue;
    const full = path.join(d, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (f.endsWith('.js') || f.endsWith('.mjs')) {
      checked++;
      try {
        execSync(`node --check "${full}"`, { stdio: 'pipe' });
      } catch (e) {
        console.error('SYNTAX ERROR IN:', full);
        console.error(e.stderr ? e.stderr.toString() : e.message);
        errors++;
      }
    }
  }
}

walk('.');
console.log(`Checked ${checked} files. Total syntax errors: ${errors}`);
