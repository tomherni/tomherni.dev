import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { getMimeType } from './mime-types';
import { cyan, formatMs, green, log, red } from './utils';

export function createHttpServer(distDir: string): http.Server {
  return http.createServer((req, res) => {
    const start = performance.now();

    if (!req.url || !req.method) {
      throw new Error('Invalid request');
    }

    const requestedFilePath = path.normalize(path.join(distDir, req.url));
    const relativeFilePath = requestedFilePath.replace(distDir, '');
    const method = req.method;

    const filePath = requestedFilePath.endsWith('/')
      ? path.join(requestedFilePath, 'index.html')
      : requestedFilePath;

    fs.stat(filePath, (error, stats) => {
      if (error || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`Error ${method} ${relativeFilePath}`);
        const ms = performance.now() - start;
        logRequestInfo(method, relativeFilePath, ms, true);
        return;
      }

      res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('end', () => {
        const ms = performance.now() - start;
        logRequestInfo(method, relativeFilePath, ms);
      });
    });
  });
}

function logRequestInfo(
  method: string,
  uri: string,
  ms: number,
  error = false,
): void {
  const status = error ? red('ERROR') : green('OK');
  log(`${method} ${status} ${cyan(uri)} ${formatMs(ms)}`);
}
