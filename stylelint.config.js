/**
 * @see https://stylelint.io/user-guide/configure/
 * @type {import('stylelint').Config}
 */
const config = {
  extends: 'stylelint-config-standard',
  rules: {
    'no-descending-specificity': null,
  },
};

export default config;
