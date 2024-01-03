import CleanCSS from 'clean-css';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { minify as minifyJs } from 'terser';
import { minify as minifyHtml } from 'html-minifier-terser';
import { DIR_DIST } from '../constants';
import { findFilesByExtension } from '../utils';

// A map of asset file paths to their hashed file names.
const fileHashMap: Record<string, string> = {};

const minifyHtmlOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
};

export async function optimize(): Promise<void> {
  optimizeCssFiles();
  await optimizeJsFiles();

  // Do not run in parallel with the above because this function renames assets.
  await optimizeHtmlFiles();
}

/**
 * Optimize CSS assets by minifying them.
 */
function optimizeCssFiles(): void {
  for (const file of findFilesByExtension('css', DIR_DIST)) {
    const input = fs.readFileSync(file, 'utf8');
    const minified = new CleanCSS().minify(input).styles;
    fs.writeFileSync(file, minified);
  }
}

/**
 * Optimize JS assets by minifying them.
 */
async function optimizeJsFiles(): Promise<void> {
  await Promise.all(
    findFilesByExtension('js', DIR_DIST).map(async (file) => {
      const contents = fs.readFileSync(file, 'utf8');
      const minified = (await minifyJs(contents)).code || '';
      fs.writeFileSync(file, minified);
    }),
  );
}

/**
 * Optimize HTML files by minifying them and hashing assets.
 */
async function optimizeHtmlFiles(): Promise<void> {
  await Promise.all(
    findFilesByExtension('html', DIR_DIST).map(async (file) => {
      const contents = fs.readFileSync(file, 'utf8');
      const minified = await minifyHtml(contents, minifyHtmlOptions);
      const output = await hashRelativeAssetUrlsInHtml(minified);
      fs.writeFileSync(file, output);
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

  return regexes.reduce((html, regex) => {
    return html.replace(regex, (match, prefix, value, suffix) => {
      return value.startsWith('.') || value.startsWith('/')
        ? `${prefix}${renameFileToHash(value)}${suffix}`
        : match;
    });
  }, contents);
}

function renameFileToHash(file: string): string {
  const absolutePath = path.join(DIR_DIST, file);

  if (!fileHashMap[absolutePath]) {
    const hash = createFileHash(absolutePath).slice(0, 6);

    // ! "-cache" in the name is important for the caching headers. It's how to
    // know for sure which assets are safe to cache long term.
    const newFileName = `${hash}-cache${path.extname(file)}`;

    const newFileRelativePath = path.join(path.dirname(file), newFileName);
    fs.renameSync(absolutePath, path.join(DIR_DIST, newFileRelativePath));
    fileHashMap[absolutePath] = newFileRelativePath;
  }

  return fileHashMap[absolutePath];
}

function createFileHash(file: string): string {
  const contents = fs.readFileSync(file, 'utf8');
  return crypto.createHash('md5').update(contents, 'utf8').digest('hex');
}
