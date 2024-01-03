/**
 * The logic in this file comes from: https://github.com/kellym/smartquotes.js
 *
 * The "smartquotes" package does not support TypeScript. There is a two-year-old
 * issue for that, but it never received any attention. So, I ended up copying the
 * logic I need. (MIT license)
 *
 * I made small modifications such as types, and logic related to options/config.
 */

const pL = 'a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ';
const word = `[${pL}_0-9]`;
const nonWord = `[^${pL}_0-9]`;

export const replacements: [RegExp, string][] = [
  // triple prime
  [/'''/g, '\u2034'],
  // beginning "
  [new RegExp(`(${nonWord}|^)"(${word})`, 'g'), '$1\u201c$2'],
  // ending "
  [/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2'],
  // remaining " at end of word
  [/([^0-9])"/g, '$1\u201d'],
  // double prime as two single quotes
  [/''/g, '\u2033'],
  // beginning '
  [new RegExp(`(${nonWord}|^)'(\\S)`, 'g'), '$1\u2018$2'],
  // conjunction's possession
  [new RegExp(`(${word})'([${pL}])`, 'ig'), '$1\u2019$2'],
  // abbrev. years like '93
  [
    new RegExp(
      `(\\u2018)([0-9]{2}[^\\u2019]*)(\\u2018([^0-9]|$)|$|\\u2019[${pL}])`,
      'ig',
    ),
    '\u2019$2$3',
  ],
  // ending '
  [new RegExp(`((\\u2018[^']*)|[${pL}])'([^0-9]|$)`, 'ig'), '$1\u2019$3'],
  // backwards apostrophe
  [
    new RegExp(
      `(\\B|^)\\u2018(?=([^\\u2018\\u2019]*\\u2019\\b)*([^\\u2018\\u2019]*\\B${nonWord}[\\u2018\\u2019]\\b|[^\\u2018\\u2019]*$))`,
      'ig',
    ),
    '$1\u2019',
  ],
  // double prime
  [/"/g, '\u2033'],
  // prime
  [/'/g, '\u2032'],
];
