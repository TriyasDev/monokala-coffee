import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const REQUIRED_FILES = [
  'index.html',
  'product.html',
  'moments.html',
  'event.html',
  'login.html',
  'css/style.css',
  'js/theme-init.js',
  'js/main.js',
  'js/logic.js',
  'js/auth.js',
  'firebase-applet-config.json',
  'sw.js',
  'sitemap.xml',
  'robots.txt',
];

async function verifyStaticBuild() {
  let totalErrors = 0;

  for (const relPath of REQUIRED_FILES) {
    try {
      const stat = await fs.stat(path.resolve(relPath));
      if (!stat.isFile() || stat.size === 0) {
        console.error(`Missing or empty required file: ${relPath}`);
        totalErrors += 1;
      }
    } catch {
      console.error(`Missing required file: ${relPath}`);
      totalErrors += 1;
    }
  }

  // Verify initial transfer budget (< 300 KB per HTML page + CSS + JS)
  const cssSize = (await fs.stat('css/style.css')).size;
  const jsSize =
    (await fs.stat('js/theme-init.js')).size +
    (await fs.stat('js/main.js')).size +
    (await fs.stat('js/logic.js')).size +
    (await fs.stat('js/auth.js')).size;

  for (const page of ['index.html', 'product.html', 'moments.html', 'event.html', 'login.html']) {
    const html = await fs.readFile(page, 'utf8');
    const htmlSize = Buffer.byteLength(html, 'utf8');
    const totalBytes = htmlSize + cssSize + jsSize;

    // Verify CSP critical style hash matches inline <style> block
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    const cspMatch = html.match(/sha256-([A-Za-z0-9+/=]+)/);
    if (styleMatch && cspMatch) {
      const actualHash = crypto.createHash('sha256').update(styleMatch[1], 'utf8').digest('base64');
      if (actualHash !== cspMatch[1]) {
        console.error(`CSP style hash mismatch in ${page}: expected sha256-${actualHash}, got sha256-${cspMatch[1]}`);
        totalErrors += 1;
      }
    } else if (styleMatch && !cspMatch) {
      console.error(`Inline <style> in ${page} is missing CSP sha256 hash`);
      totalErrors += 1;
    }

    if (totalBytes > 300 * 1024) {
      console.error(`${page} exceeds 300 KB initial transfer budget: ${(totalBytes / 1024).toFixed(1)} KB`);
      totalErrors += 1;
    } else {
      console.log(`OK ${page}: ${(totalBytes / 1024).toFixed(1)} KB (HTML+CSS+JS)`);
    }
  }

  if (totalErrors > 0) {
    process.exit(1);
  }
  console.log('Static build verification passed.');
}

verifyStaticBuild();
