import path from 'path';

const cssImportsToTransform = new Set();

export function importCss() {
  return {
    name: 'custom-import-css',
    buildStart() {
      cssImportsToTransform.clear();
    },
    resolveId(source, importer) {
      if (source?.endsWith('.css') && importer?.endsWith('.js')) {
        const importerDirname = path.dirname(importer);
        const file = path.join(importerDirname, source);
        cssImportsToTransform.add(file);
      }
    },
    transform(code, id) {
      if (cssImportsToTransform.has(id)) {
        return { code: `export default \`${code}\`` };
      }
    },
    buildEnd() {
      cssImportsToTransform.clear();
    },
  };
}
