import { ExecException, execSync } from 'node:child_process';
import fs from 'node:fs';
import { formatMs, green, log, red } from './utils';

const BUILD_CMD = 'npm run build:dev';

let timeout: NodeJS.Timeout;
let building = false;
let changedFiles: string[] = [];

export function buildOnFileChanges(srcDir: string): fs.FSWatcher {
  return fs.watch(srcDir, { recursive: true }, (_eventType, file) => {
    if (isRelevantFile(file) && !changedFiles.includes(file)) {
      changedFiles.push(file);
      if (!building) {
        scheduleBuild();
      }
    }
  });
}

function isRelevantFile(file: string | null): file is string {
  return typeof file === 'string' && !file.endsWith('~');
}

function scheduleBuild() {
  timeout && clearTimeout(timeout);
  timeout = setTimeout(() => {
    building = true;
    build();
    building = false;

    // Schedule another build if files changed in the meantime.
    if (changedFiles.length > 0) {
      scheduleBuild();
    }
  }, 150);
}

function build() {
  const start = performance.now();
  changedFiles = [];
  log('Changes detected. Building…');

  try {
    execSync(BUILD_CMD);
    logBuildFinishedMessage(start);
  } catch (error) {
    console.log((error as ExecException).stdout!.toString());
    logBuildFinishedMessage(start, true);
  }
}

function logBuildFinishedMessage(startTimestamp: number, error = false): void {
  const status = error ? red('ERROR') : green('OK');
  const ms = formatMs(performance.now() - startTimestamp);
  log(`Build finished: ${status} ${ms}`);
}
