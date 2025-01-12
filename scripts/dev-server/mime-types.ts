import path from 'node:path';

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain',
};

export function getMimeType(fileNameOrPath: string): string {
  const ext = path.extname(fileNameOrPath);
  return mimeTypes[ext] || 'application/octet-stream';
}
