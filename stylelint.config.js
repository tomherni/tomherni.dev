// (*) Original regex: ^([a-z][a-z0-9]*)(-[a-z0-9]+)*$
// https://github.com/stylelint/stylelint-config-standard/blob/9d8d64daf469c6e7466594ceb003065556bcecba/index.js

module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'media-feature-range-notation': null, // Lacks desired browser support
    'selector-class-pattern': [
      // Support emoji class names (*)
      /^([a-z\p{Extended_Pictographic}][a-z0-9\p{Extended_Pictographic}]*)(-[a-z0-9\p{Extended_Pictographic}]+)*$/u,
      {
        message: (selector) =>
          `Expected class selector "${selector}" to be kebab-case`,
      },
    ],
  },
};
