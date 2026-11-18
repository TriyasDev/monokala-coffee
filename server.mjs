import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

const CLEAN_ROUTES = {
  '/': '/index.html',
  '/home': '/index.html',
  '/product': '/product.html',
  '/moments': '/moments.html',
  '/event': '/event.html',
  '/events': '/event.html',
  '/login': '/login.html',
};

function resolveSafePath(urlPath) {
  const cleanPath = urlPath.split('?')[0].split('#')[0];
  const mappedPath = CLEAN_ROUTES[cleanPath] || cleanPath;
  const normalized = path.normalize(mappedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(__dirname, normalized);
  if (!fullPath.startsWith(__dirname)) {
    return null;
  }
  return fullPath;
}

const server = http.createServer(async (req, res) => {
  const method = req.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  const filePath = resolveSafePath(req.url || '/');
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = await fs.readFile(filePath);
    const isCodeOrDoc = ['.html', '.css', '.js', '.mjs', '.json'].includes(ext);

    res.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': isCodeOrDoc ? 'no-cache, must-revalidate' : 'public, max-age=3600',
    });

    if (method === 'HEAD') {
      res.end();
      return;
    }
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Monokala Coffee static server running at http://localhost:${PORT}`);
});
