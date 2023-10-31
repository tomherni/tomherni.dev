function isCssRequestForJS(context) {
  return (
    context.request.url.startsWith('/js/') &&
    context.request.url.endsWith('.css')
  );
}

export default function importCss() {
  return {
    name: 'import-css',
    transform(context) {
      if (isCssRequestForJS(context)) {
        return {
          body: `export default \`${context.body}\``,
          headers: {
            'content-type': 'application/javascript; charset=utf-8',
          },
        };
      }
    },
  };
}
