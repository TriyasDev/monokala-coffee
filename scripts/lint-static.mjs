import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const JS_FILES = ['server.mjs', 'js/theme-init.js', 'js/main.js', 'js/logic.js', 'js/auth.js', 'sw.js', 'tests/logic.test.mjs'];
const HTML_FILES = ['index.html', 'product.html', 'moments.html', 'event.html', 'login.html'];

async function lintStatic() {
  let errors = 0;

  for (const file of JS_FILES) {
    try {
      await execFileAsync('node', ['--check', file]);
    } catch (err) {
      console.error(`Syntax error in ${file}:`, err.stderr || err.message);
      errors += 1;
    }
  }

  const bannedJsPatterns = [
    { re: /\binnerHTML\b/, msg: 'forbidden DOM sink (inner-HTML)' },
    { re: /\bouterHTML\b/, msg: 'forbidden DOM sink (outer-HTML)' },
    { re: /\binsertAdjacentHTML\b/, msg: 'forbidden DOM sink (insert-Adjacent-HTML)' },
    { re: /\beval\s*\(/, msg: 'eval() is forbidden' },
    { re: /\bnew\s+Function\b/, msg: 'new Function is forbidden' },
    { re: /\bdocument\.write\b/, msg: 'document.write is forbidden' },
  ];

  for (const file of ['js/theme-init.js', 'js/main.js', 'js/logic.js', 'js/auth.js']) {
    const code = await fs.readFile(file, 'utf8');
    for (const rule of bannedJsPatterns) {
      if (rule.re.test(code)) {
        console.error(`Security violation in ${file}: ${rule.msg}`);
        errors += 1;
      }
    }
  }

  for (const file of HTML_FILES) {
    const html = await fs.readFile(file, 'utf8');
    if (/\sonclick\s*=/i.test(html)) {
      console.error(`Inline onclick attribute found in ${file}`);
      errors += 1;
    }
    if (/\sstyle\s*=/i.test(html)) {
      console.error(`Inline style attribute found in ${file} (violates strict CSP)`);
      errors += 1;
    }
    if (/<script(?![^>]*type="application\/ld\+json")(?![^>]*src=)[^>]*>/i.test(html)) {
      console.error(`Inline executable <script> found in ${file}`);
      errors += 1;
    }
    if (!/<html[^>]*lang="id"/i.test(html)) {
      console.error(`Missing lang="id" in ${file}`);
      errors += 1;
    }
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1Count !== 1) {
      console.error(`Expected exactly 1 <h1> in ${file}, found ${h1Count}`);
      errors += 1;
    }
    const targetBlankLinks = html.match(/<a[^>]*target="_blank"[^>]*>/gi) || [];
    for (const tag of targetBlankLinks) {
      if (
        !/rel="[^"]*noopener[^"]*noreferrer[^"]*"/i.test(tag) &&
        !/rel="[^"]*noreferrer[^"]*noopener[^"]*"/i.test(tag)
      ) {
        console.error(`Link with target="_blank" missing rel="noopener noreferrer" in ${file}: ${tag}`);
        errors += 1;
      }
    }
  }

  if (errors > 0) {
    process.exit(1);
  }
  console.log('Static lint passed (JS syntax, CSP/XSS safety, semantic HTML, rel="noopener noreferrer").');
}

lintStatic();
