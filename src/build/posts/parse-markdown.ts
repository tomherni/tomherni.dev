import { marked, Renderer, type Token, type Tokens } from 'marked';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import prism from 'prismjs';
import sharp, { type Metadata } from 'sharp';
import { encode } from '../../utils/html.js';
import { slugify } from '../../utils/string.js';
import { BUILD } from '../../config.js';
import { DIR_DIST, DIR_SRC_STATIC } from '../../constants.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-typescript.js';

const processedImageSymbol = Symbol('processed-image');

type ProcessedImage = {
  href: string;
  metadata: Metadata;
  mode: string | undefined;
};

type ProcessedImageToken = Tokens.Image & {
  [processedImageSymbol]: ProcessedImage;
};

export async function parseMarkdown(
  content: string,
  file: string,
): Promise<string> {
  const renderer = new Renderer();

  // TODO: process paragraphs and render standalone images outside paragraphs.
  renderer.code = addSyntaxHighlighting;
  renderer.heading = addHeadingAnchor;
  renderer.image = useProcessedImage;
  renderer.link = secureExternalLink;

  return marked.parse(content, {
    renderer,
    async: true,
    // Tokens are processed before the renderer gets executed. And unlike the
    // renderer, this can run async and will be awaited, which allows for the
    // operations to optimize images.
    async walkTokens(token) {
      if (isMarkedImageToken(token)) {
        (token as ProcessedImageToken)[processedImageSymbol] =
          await addProcessedImage(token, file);
      }
    },
  });
}

function addSyntaxHighlighting({ text, lang }: Tokens.Code): string {
  if (!lang) {
    return `<pre><code>${encode(text)}</code></pre>`;
  }

  // TODO: remove imports & try to dynamically import here
  const language = prism.languages[lang];
  if (!language) {
    throw new Error(
      `Language "${lang}" is not supported by Prism; it may need to be imported.`,
    );
  }

  const highlighted = prism.highlight(text, language, lang);
  return `<pre><code class="language-${lang}">${highlighted}</code></pre>`;
}

function addHeadingAnchor({ text, depth }: Tokens.Heading): string {
  // Don't add anchors to the smaller headings.
  if (depth > 3) {
    return `<h${depth}>${text}</h${depth}>`;
  }
  const id = slugify(text);
  return `<h${depth} id="${id}">${text}<a href="#${id}" class="anchor">#</a></h${depth}>\n`;
}

function useProcessedImage(token: ProcessedImageToken): string {
  const { text, [processedImageSymbol]: image } = token;

  return `
    <img
      src="${image.href}"
      alt="${text}"
      width="${image.metadata.width}"
      height="${image.metadata.height}"
      class="${image.mode || ''}"
      loading="lazy"
    />
  `;
}

function secureExternalLink({ text, href }: Tokens.Link): string {
  return href.startsWith(BUILD.baseUrl)
    ? `<a href="${href}">${text}</a>`
    : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
}

/**
 * Convert images to WebP, retrieve metadata (e.g. width and height), and check
 * whether the images are for light mode or dark mode. This information can be
 * used to show optimized images in the Marked renderer callback.
 */
async function addProcessedImage(
  token: Tokens.Image,
  file: string,
): Promise<ProcessedImage> {
  const modeMatch = token.href.match(/#([a-z-]+)$/); // `#light-mode` or `#dark-mode`
  const hrefWithoutMode = token.href.slice(0, modeMatch?.index);
  const imageSrcPath = path.join(path.dirname(file), hrefWithoutMode);
  const imagePath = resolveSrcDirToDistDir(imageSrcPath);

  const webpHref = path.parse(imagePath).name + '.webp';
  const webpImagePath = path.join(path.dirname(imagePath), webpHref);

  // TODO: resize images to the website layout max-width. But `sharp` resizes
  // are blurry (sharpen() doesn't look great). So maybe an alternative lib?
  await sharp(imagePath).webp({ lossless: true }).toFile(webpImagePath);
  const metadata = await sharp(webpImagePath).metadata();
  await fs.rm(imagePath);

  return { href: webpHref, metadata, mode: modeMatch?.[1] };
}

function resolveSrcDirToDistDir(file: string): string {
  return path.join(DIR_DIST, path.relative(DIR_SRC_STATIC, file));
}

function isMarkedImageToken(token: Token): token is Tokens.Image {
  return token.type === 'image';
}
