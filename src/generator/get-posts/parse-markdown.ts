import type { BuildConfig } from '@types';
import { marked, Renderer } from 'marked';
import prism from 'prismjs';
import { encodeHtml, slugify } from '../../utils/format';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-typescript.js';

export function parseMarkdown(content: string, config: BuildConfig): string {
  const renderer = new Renderer();

  addSyntaxHighlighting(renderer);
  addHeadingAnchor(renderer);
  secureExternalLinks(renderer, config);

  const parsed = marked(content, { renderer });

  // Safeguard in case an async plugin ever makes it return a Promise.
  if (typeof parsed !== 'string') {
    throw new Error('Markdown parsing failed');
  }
  return parsed;
}

function addSyntaxHighlighting(renderer: Renderer): void {
  renderer.code = (code, infostring) => {
    if (!infostring) {
      return `<pre><code>${encodeHtml(code)}</code></pre>`;
    }

    const language = prism.languages[infostring];

    if (!language) {
      throw new Error(
        `Language not supported by Prism: ${infostring}. It may needs to be imported.`,
      );
    }

    const highlightedCode = prism.highlight(code, language, infostring);
    return `<pre><code class="language-${infostring}">${highlightedCode}</code></pre>`;
  };
}

function addHeadingAnchor(renderer: Renderer): void {
  const originalHeadingRenderer = renderer.heading;

  renderer.heading = (text, level, raw) => {
    const html = originalHeadingRenderer.call(renderer, text, level, raw);

    // Don't add anchors to the smaller headings.
    if (level > 3) {
      return html;
    }

    const headingId = slugify(raw);
    return html
      .replace(/<h(\d)/, (match) => `${match} id="${headingId}"`)
      .replace(
        /<\/h(\d)>/,
        (match) => `<a href="#${headingId}" class="anchor">#</a>${match}`,
      );
  };
}

function secureExternalLinks(renderer: Renderer, config: BuildConfig): void {
  const originalLinkRenderer = renderer.link;

  renderer.link = (href, ...args) => {
    const html = originalLinkRenderer.call(renderer, href, ...args);
    return href && !href.startsWith(config.baseUrl)
      ? html.replace(/<a/, '<a target="_blank" rel="noopener noreferrer"')
      : html;
  };
}
