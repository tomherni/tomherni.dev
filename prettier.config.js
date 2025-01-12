/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import('prettier').Config}
 */
const config = {
  singleQuote: true,
  overrides: [
    {
      files: '*.html',
      options: {
        printWidth: 120,
      },
    },
  ],
};

export default config;
