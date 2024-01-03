import fs from 'fs';
import path from 'path';
import url from 'url';
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
 * Find all files in a directory with a given extension.
 */
export function findFilesByExtension(
  extension: string,
  directory: string,
): string[] {
  const filesFound: string[] = [];

  function findFilesRecursively(currentDirectory: string): void {
    const files = fs.readdirSync(currentDirectory);

    for (const file of files) {
      const filePath = path.join(currentDirectory, file);

      if (fs.statSync(filePath).isDirectory()) {
        findFilesRecursively(filePath);
      } else if (path.extname(file) === `.${extension}`) {
        filesFound.push(filePath);
      }
    }
  }

  findFilesRecursively(directory);

  return filesFound;
}
