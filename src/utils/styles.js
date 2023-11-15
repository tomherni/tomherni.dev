const supportsAdoptedStyleSheets =
  window.ShadowRoot &&
  'adoptedStyleSheets' in Document.prototype &&
  'replace' in CSSStyleSheet.prototype;

export function renderStylesToShadowRoot(shadowRoot, styles) {
  if (supportsAdoptedStyleSheets) {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(styles);
    shadowRoot.adoptedStyleSheets = [stylesheet];
  } else {
    const style = document.createElement('style');
    style.textContent = styles;
    shadowRoot.append(style);
  }
}
