import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { DIR_DIST, DIR_SRC_LAYOUTS } from './constants';
import { getState } from './state';

export function isObject(arg: unknown): arg is object {
  return Object.prototype.toString.call(arg) === '[object Object]';
}

export function getLayoutPath(layout: string): string {
  const layoutPath = path.join(DIR_SRC_LAYOUTS, `${layout}.ts`);

  if (!fs.existsSync(layoutPath)) {
    throw new Error('Layout does not exist');
  }
  return layoutPath;
}

export function resolveUrl(file: string): string {
  const relativePath = path.relative(DIR_DIST, file);
  const relativeUrl = path.normalize(path.dirname(relativePath) + '/');
  return url.resolve(getState().build.baseUrl, relativeUrl);
}

/**
 * Ensure a directory exists (by creating it if necessary).
 */
export function ensureDir(dir: string): void {
  const dirName = path.dirname(dir);
  fs.mkdirSync(dirName, { recursive: true });
}

/**
 * Create a new file.
 */
export function createFile(file: string, content: string): void {
  ensureDir(file);
  fs.writeFileSync(file, content);
}

/**
 * Copy the source directory to the target directory.
 */
export function copySourceToTarget(source: string, target: string): void {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copySourceToTarget(sourcePath, targetPath);
    } else if (!['.md', '.ts'].includes(path.extname(sourcePath))) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

/**
 * Deep find all files in a directory by file extension.
 */
export function findFilesByExtension(
  extension: string,
  directory: string,
): string[] {
  const filesFound: string[] = [];

  function findFilesRecursively(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findFilesRecursively(entryPath);
      } else if (path.extname(entry.name) === `.${extension}`) {
        filesFound.push(entryPath);
      }
    }
  }

  findFilesRecursively(directory);

  return filesFound;
}
