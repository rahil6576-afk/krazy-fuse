import fs from 'fs';

function findSyntaxError(file) {
  const code = fs.readFileSync(file, 'utf8');
  const lines = code.split('\n');

  // Let's test progressively larger prefixes to find the exact line
  let goodLine = 0;
  for (let i = 1; i <= lines.length; i++) {
    const sub = lines.slice(0, i).join('\n');
    try {
      new Function(sub.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '// import').replace(/export\s+default\s+/g, '').replace(/export\s+/g, ''));
      goodLine = i;
    } catch (e) {
      if (e instanceof SyntaxError && e.message.includes('Unexpected token \'}\'')) {
        console.log(`FOUND SYNTAX ERROR in ${file} around line ${i}: ${lines[i-1].trim()}`);
        console.log(`Error: ${e.message}`);
        // print surrounding lines
        for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 5); j++) {
          console.log(`  ${j + 1}: ${lines[j]}`);
        }
        return;
      }
    }
  }
  console.log(`No early '}' syntax error found line by line in ${file}`);
}

findSyntaxError('fallen-one/js/game.js');
findSyntaxError('fallen-one/js/graphics/fighterSprites.js');
