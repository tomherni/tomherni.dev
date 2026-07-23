import { transform } from 'lightningcss';
import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { minify as minifyHtml } from 'html-minifier-terser';
import { minify as minifyJs } from 'terser';
import { findFilesByExtension } from '../utils/node.js';
import { DIR_DIST } from '../constants.js';

// A map of asset file paths to their hashed file names. This prevents issues
// when multiple async operations try to change the same file at the same time.
const fileHashCache = new Map<string, Promise<string>>();

const minifyHtmlOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
};

export async function optimize(): Promise<void> {
  await optimizeCssFiles();
  await optimizeJsFiles();

  // Do not run in parallel with the above because this function renames assets.
  await optimizeHtmlFiles();
}

/**
 * Optimize CSS assets by minifying them.
 */
async function optimizeCssFiles(): Promise<void> {
  const cssFiles = await findFilesByExtension('css', DIR_DIST);
  await Promise.all(
    cssFiles.map(async (file) => {
      const input = await fs.readFile(file);
      // `filename` is required but unused.
      const { code } = transform({ filename: 'x', code: input, minify: true });
      await fs.writeFile(file, code);
    }),
  );
}

/**
 * Optimize JS assets by minifying them.
 */
async function optimizeJsFiles(): Promise<void> {
  const jsFiles = await findFilesByExtension('js', DIR_DIST);
  await Promise.all(
    jsFiles.map(async (file) => {
      const contents = await fs.readFile(file, 'utf8');
      const minified = (await minifyJs(contents)).code || '';
      await fs.writeFile(file, minified);
    }),
  );
}

/**
 * Optimize HTML files by minifying them and hashing assets.
 */
async function optimizeHtmlFiles(): Promise<void> {
  const htmlFiles = await findFilesByExtension('html', DIR_DIST);
  await Promise.all(
    htmlFiles.map(async (file) => {
      const contents = await fs.readFile(file, 'utf8');
      const minified = await minifyHtml(contents, minifyHtmlOptions);
      const output = await hashRelativeAssetUrlsInHtml(minified);
      await fs.writeFile(file, output);
    }),
  );
}

async function hashRelativeAssetUrlsInHtml(contents: string): Promise<string> {
  // The regexes are based on the current way the HTML pages are minified.
  const regexes = [
    /(<link[\s\S]*?href=)([^\s>]+)([\s\S]*?>)/g,
    /(<img[\s\S]*?src=)([^\s>]+)([\s\S]*?>)/g,
    /(<script[\s\S]*?src=)([^\s>]+)([\s\S]*?>)/g,
    /(<source[\s\S]*?srcset=)([^\s>]+)([\s\S]*?>)/g,
    /(window\._paths_\..*?=")([\s\S]*?)(")/g,
  ];

  let html = contents;

  for (const regex of regexes) {
    const matches = [...html.matchAll(regex)];

    // Find all replacements.
    const replacements = await Promise.all(
      matches.map(async (match) => {
        const [fullMatch, prefix, value, suffix] = match;
        return {
          start: match.index,
          end: match.index + fullMatch.length,
          replacement:
            value.startsWith('.') || value.startsWith('/')
              ? `${prefix}${await hashFile(value)}${suffix}`
              : fullMatch,
        };
      }),
    );

    // Apply replacements.
    for (const { start, end, replacement } of replacements.reverse()) {
      html = html.slice(0, start) + replacement + html.slice(end);
    }
  }

  return html;
}

function hashFile(file: string): Promise<string> {
  const absolutePath = path.join(DIR_DIST, file);

  if (!fileHashCache.has(absolutePath)) {
    fileHashCache.set(absolutePath, renameFileWithHash(file, absolutePath));
  }
  return fileHashCache.get(absolutePath)!;
}

async function renameFileWithHash(
  file: string,
  absoluteFilePath: string,
): Promise<string> {
  const hash = (await createFileHash(absoluteFilePath)).slice(0, 6);

  // ! "-cache" in the name is important for the caching headers. It's how to
  // know for sure which assets are safe to cache long term.
  const newFileName = `${hash}-cache${path.extname(file)}`;

  const newFileRelativePath = path.join(path.dirname(file), newFileName);
  await fs.rename(absoluteFilePath, path.join(DIR_DIST, newFileRelativePath));

  return newFileRelativePath;
}

async function createFileHash(file: string): Promise<string> {
  const contents = await fs.readFile(file, 'utf8');
  return crypto.createHash('md5').update(contents, 'utf8').digest('hex');
}
