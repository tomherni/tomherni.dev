import terser from '@rollup/plugin-terser';
import html from '@web/rollup-plugin-html';
import copy from 'rollup-plugin-copy';
import importCss from './scripts/rollup-import-css.mjs';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';

export default {
  input: `${SRC_DIR}/index.html`,
  output: {
    dir: DIST_DIR,
    format: 'es',
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
  },
  preserveEntrySignatures: false,
  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({ minify: true }),

    /** Support CSS imports */
    importCss(),

    /** Generate minified JS bundle */
    terser(),

    /** Copy images */
    copy({
      targets: [{ src: `${SRC_DIR}/assets/img/`, dest: `${DIST_DIR}/assets/` }],
    }),
  ],
};
