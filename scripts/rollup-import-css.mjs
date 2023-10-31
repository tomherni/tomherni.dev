export default function importCss(options) {
  return {
    name: 'custom-import-css',
    transform(code, id) {
      if (id.includes(options.cssForJsSrc) && id.endsWith('.css')) {
        return { code: `export default \`${code}\`` };
      }
    },
  };
}
