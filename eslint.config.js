import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import globals from 'globals';
import path from 'node:path';
import url from 'node:url';
import tseslint from 'typescript-eslint';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

/** @type {import('eslint').Linter.Config[]} */
const config = [
  includeIgnoreFile(gitignorePath),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
];

export default config;
