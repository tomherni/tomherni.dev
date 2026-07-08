import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Unfortunately, Node.js does not provide a `existsSync()`-like function in the
 * `fs.promises` API, so we have to implement our own.
 * https://github.com/nodejs/node/issues/39960
 */
async function exists(file: string): Promise<boolean> {
  return fs.access(file).then(
    () => true,
    () => false,
  );
}

/**
 * Ensure a directory exists (by creating it if necessary).
 */
async function ensureDir(dir: string): Promise<void> {
  const dirName = path.dirname(dir);
  await fs.mkdir(dirName, { recursive: true });
}

/**
 * Create a new file.
 */
export async function createFile(file: string, content: string): Promise<void> {
  await ensureDir(file);
  await fs.writeFile(file, content);
}

/**
 * Copy the source directory to the target directory.
 */
export async function copySourceToTarget(
  source: string,
  target: string,
): Promise<void> {
  if (!(await exists(target))) {
    await fs.mkdir(target);
  }

  const entries = await fs.readdir(source, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        await copySourceToTarget(sourcePath, targetPath);
      } else if (!['.md', '.ts'].includes(path.extname(sourcePath))) {
        await fs.copyFile(sourcePath, targetPath);
      }
    }),
  );
}

/**
 * Deep find all files in a directory by file extension.
 */
export async function findFilesByExtension(
  extension: string,
  directory: string,
): Promise<string[]> {
  const filesFound: string[] = [];

  async function findFilesRecursively(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await findFilesRecursively(entryPath);
        } else if (path.extname(entry.name) === `.${extension}`) {
          filesFound.push(entryPath);
        }
      }),
    );
  }

  await findFilesRecursively(directory);

  return filesFound;
}
