import fs from 'fs';
import { copySync } from 'fs-extra/esm';

const SRC_PATH = 'src';
const DIST_PATH = 'dist';

// Prepare the dist folder.
fs.rmSync(DIST_PATH, { recursive: true, force: true });
fs.mkdirSync(DIST_PATH);

// Copy contents of SRC to DIST.
copySync(SRC_PATH, DIST_PATH);

