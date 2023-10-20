import fs from 'fs';
import path from 'path';
import { copySync } from 'fs-extra/esm';
import CleanCSS from 'clean-css';
import { minify } from 'html-minifier-terser';

const SRC_PATH = 'src';
const DIST_PATH = 'dist';

// Prepare the dist folder.
fs.rmSync(DIST_PATH, { recursive: true, force: true });
fs.mkdirSync(DIST_PATH);

// Copy contents of SRC to DIST.
copySync(SRC_PATH, DIST_PATH);

// Minify CSS.
const cssPath = path.join(DIST_PATH, 'css/styles.css')
const unminifiedStyles = fs.readFileSync(cssPath, 'utf8');
const { styles } = new CleanCSS().minify(unminifiedStyles);
fs.writeFileSync(cssPath, styles);

// Minify HTML.
const htmlPath = path.join(DIST_PATH, 'index.html');
const unminifiedHtml = fs.readFileSync(htmlPath, 'utf8');
const html = await minify(unminifiedHtml, { collapseWhitespace: true });
fs.writeFileSync(htmlPath, html);
