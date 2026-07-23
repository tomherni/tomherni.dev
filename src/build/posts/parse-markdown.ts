import { marked, Renderer } from 'marked';
import prism from 'prismjs';
import { encode } from '../../utils/html.js';
import { slugify } from '../../utils/string.js';
import { BUILD } from '../../config.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-typescript.js';

export function parseMarkdown(content: string): string {
  const renderer = new Renderer();

  addSyntaxHighlighting(renderer);
  addHeadingAnchor(renderer);
  secureExternalLinks(renderer);

  const parsed = marked.parse(content, { renderer });

  // Safeguard in case an async plugin ever makes it return a Promise.
  if (typeof parsed !== 'string') {
    throw new Error('Markdown parsing failed');
  }
  return parsed;
}

function addSyntaxHighlighting(renderer: Renderer): void {
  renderer.code = ({ text, lang }) => {
    if (!lang) {
      return `<pre><code>${encode(text)}</code></pre>`;
    }

    const language = prism.languages[lang];
    if (!language) {
      throw new Error(
        `Language "${lang}" is not supported by Prism; it may need to be imported.`,
      );
    }

    const highlighted = prism.highlight(text, language, lang);
    return `<pre><code class="language-${lang}">${highlighted}</code></pre>`;
  };
}

function addHeadingAnchor(renderer: Renderer): void {
  renderer.heading = ({ text, depth }) => {
    // Don't add anchors to the smaller headings.
    if (depth > 3) {
      return `<h${depth}>${text}</h${depth}>`;
    }
    const id = slugify(text);
    return `<h${depth} id="${id}">${text}<a href="#${id}" class="anchor">#</a></h${depth}>\n`;
  };
}

function secureExternalLinks(renderer: Renderer): void {
  renderer.link = ({ text, href }) => {
    return href.startsWith(BUILD.baseUrl)
      ? `<a href="${href}">${text}</a>`
      : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };
}
