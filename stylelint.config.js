/**
 * @see https://stylelint.io/user-guide/configure/
 * @type {import('stylelint').Config}
 */
const config = {
  extends: 'stylelint-config-standard',
  rules: {
    'media-feature-range-notation': null, // Lacks desired browser support
    'no-descending-specificity': null,
  },
};

export default config;
