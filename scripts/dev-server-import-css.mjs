import path from 'path';

const cssImportsToTransform = new Set();

export default function importCss() {
  return {
    name: 'custom-import-css',
    serverStart() {
      cssImportsToTransform.clear();
    },
    resolveImport(args) {
      const { source } = args;
      const importer = args.context.request.url;

      if (source.endsWith('.css') && importer.endsWith('.js')) {
        const importerDirname = path.dirname(importer);
        const file = path.join(importerDirname, source);
        cssImportsToTransform.add(file);
      }
    },
    transform(context) {
      const file = context.request.url;

      if (cssImportsToTransform.has(file)) {
        return {
          body: `export default \`${context.body}\``,
          headers: {
            'content-type': 'application/javascript; charset=utf-8',
          },
        };
      }
    },
    serverStop() {
      cssImportsToTransform.clear();
    },
  };
}
