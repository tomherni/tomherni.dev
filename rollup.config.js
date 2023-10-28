import terser from '@rollup/plugin-terser';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import html from '@web/rollup-plugin-html';
import copy from 'rollup-plugin-copy';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';

export default {
  input: `${SRC_DIR}/index.html`,
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: DIST_DIR,
  },
  preserveEntrySignatures: false,
  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({ minify: true }),

    /** Generate minified JS bundle */
    terser(),

    /** Bundle assets references via import.meta.url */
    importMetaAssets(),

    /** Copy the favicon */
    copy({
      targets: [{ src: `${SRC_DIR}/img/favicon.ico`, dest: `${DIST_DIR}/img` }],
    }),
  ],
};
