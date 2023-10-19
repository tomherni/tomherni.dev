/* eslint-disable import/no-extraneous-dependencies */
import { promises as fs } from 'fs';

function resolvePath(path) {
  return new URL(path, import.meta.url).pathname;
}

// "this is @import url('some/foo.css') something".match(/\@import url\(.+\)/gi)[0];

(async () => {
  // await fs.readFile(path.resolve(__dirname, 'assets/styles'));

  const dir = resolvePath('assets/styles/');
  const result = (await fs.readdir(dir)).filter(file => file.endsWith('.css'));
  console.log(result);

  // ...

  const file = await fs.readFile(resolvePath('index.html'), 'utf8');
  console.log(file);
})();
