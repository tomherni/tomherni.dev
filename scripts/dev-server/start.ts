import fs from 'node:fs';
import path from 'node:path';
import { createHttpServer } from './http-server';
import { green, log } from './utils';
import { buildOnFileChanges } from './watcher';

type DevServerConfig = {
  src: string; // Directory to watch for file changes.
  dist: string; // Directory to serve files from.
  port: number;
};

export function startDevServer(config: DevServerConfig): void {
  const srcDir = path.resolve(config.src);
  const distDir = path.resolve(config.dist);

  const server = createHttpServer(distDir);
  let watcher: fs.FSWatcher;

  server.listen(config.port, () => {
    watcher = buildOnFileChanges(srcDir);
    logServerStartMessage(config.port);
  });

  process.on('SIGINT', () => {
    console.log();
    log('Gracefully shutting down…');
    watcher?.close();
    server?.close(() => process.exit(0));
  });
}

function logServerStartMessage(port: number): void {
  const localhostUrl = `http://localhost:${port}`;
  console.log(green('┌────────────────────────────────────┐'));
  console.log(`${green('│ ✓')} tomherni.dev server is running.  ${green('│')}`);
  console.log(`${green('│')}   ${localhostUrl}            ${green('│')}`);
  console.log(green('└────────────────────────────────────┘'));
  console.log();
}
