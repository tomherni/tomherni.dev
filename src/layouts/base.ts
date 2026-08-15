import type { Layout, PageData, Post } from '#types';
import { html, when } from '../utils/html.js';
import { BUILD, DESCRIPTION, TITLE } from '../config.js';
import { SOCIAL_MIME_TYPE } from '../constants.js';

type PageMetadata = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type: 'article' | 'website';
  name: string;
  url: string;
  date?: string;
  updated?: string;
  tags?: string[];
};

function getPageMetadata(data: PageData): PageMetadata {
  const post = 'post' in data && data.post ? (data.post as Post) : undefined;

  const title = data.title ? `${data.title} — ${TITLE}` : TITLE;

  const description = data.description || DESCRIPTION;

  const image = post
    ? post.meta.socialUrl
    : new URL('/assets/img/social-homepage.jpg', BUILD.baseUrl).href;

  const imageAlt = post
    ? `Banner that introduces the blog post by its title: ${post.meta.title}`
    : 'Profile picture of Tom Herni—a front-end engineer passionate about designing and building creative solutions for the web';

  const date = data.date?.toString();
  const updated =
    data.updated?.toString() ||
    date ||
    BUILD.date.toString({ smallestUnit: 'millisecond' });

  return {
    title,
    description,
    image,
    imageAlt,
    type: post ? 'article' : 'website',
    name: TITLE,
    url: data.url,
    tags: post ? post.meta.tags : undefined,
    date,
    updated,
  };
}

function createOpenGraphTags(metadata: PageMetadata): string {
  let output = html`
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${metadata.title}" />
    <meta property="og:description" content="${metadata.description}" />
    <meta property="og:url" content="${metadata.url}" />
    <meta property="og:site_name" content="${metadata.name}" />
    <meta property="og:image" content="${metadata.image}" />
    <meta property="og:image:alt" content="${metadata.imageAlt}" />
    <meta property="og:image:type" content="${SOCIAL_MIME_TYPE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="600" />
    <meta property="og:type" content="${metadata.type}" />
    <meta property="article:section" content="Development" />
  `;

  if (metadata.date) {
    output += html`<meta
      property="article:published_time"
      content="${metadata.date}"
    />`;
  }

  if (metadata.updated) {
    output += html`<meta
      property="article:modified_time"
      content="${metadata.updated}"
    />`;
  }

  metadata.tags?.forEach((tag) => {
    output += html`<meta property="article:tag" content="${tag}" />`;
  });

  return output;
}

function addAnalytics(): string {
  return html`
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=G-9NLEB0TDGG"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-9NLEB0TDGG');
    </script>
  `;
}

const layout: Layout = (data) => {
  const metadata = getPageMetadata(data);

  return {
    ...data,
    content: html`
      <!doctype html>
      <html lang="en-US" dir="ltr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>${metadata.title}</title>
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/rubik/v31/iJWKBXyIfDnIV7nBrXyw023e.woff2"
            as="font"
            type="font/woff2"
            crossorigin="anonymous"
          />
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/rubik/v31/iJWEBXyIfDnIV7nEnX661E_c5Ig.woff2"
            as="font"
            type="font/woff2"
            crossorigin="anonymous"
          />
          <link
            rel="preload"
            href="/assets/css/styles-lazy.css"
            as="style"
            onload="this.onload=null;this.rel='stylesheet'"
          />
          <meta name="description" content="${metadata.description}" />
          <meta name="robots" content="index,follow" />
          <link rel="canonical" href="${metadata.url}" />
          ${createOpenGraphTags(metadata)}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${metadata.title}" />
          <meta name="twitter:description" content="${metadata.description}" />
          <meta name="twitter:creator" content="@tomherni" />
          <meta name="twitter:image" content="${metadata.image}" />
          <meta name="twitter:image:alt" content="${metadata.image}" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link
            rel="icon"
            href="/favicon.svg"
            type="image/svg+xml"
            sizes="any"
          />
          <script>
            // Set up the theme before loading the CSS so that the correct
            // CSS properties can be used from the start.
            const theme =
              localStorage.getItem('color-scheme') ||
              (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light');
            document.documentElement.setAttribute('data-theme', theme);
          </script>
          <link rel="stylesheet" href="/assets/css/styles.css" />
          <noscript>
            <link rel="stylesheet" href="/assets/css/styles-lazy.css" />
          </noscript>
          <link
            rel="alternate"
            type="application/atom+xml"
            title="Posts on ${metadata.title}"
            href="${new URL('atom.xml', BUILD.baseUrl).href}"
          />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Posts on ${metadata.title}"
            href="${new URL('rss.xml', BUILD.baseUrl).href}"
          />
          ${when(BUILD.env === 'PROD', () => addAnalytics())}
        </head>
        <body>
          <div class="wrapper">
            <header class="site-header">
              <nav aria-label="Main navigation">
                <a
                  href="/"
                  class="logo"
                  aria-current="${String(data.activePage === 'home')}"
                  data-prefetch
                >
                  tomherni<span>.dev</span>
                </a>
                <a
                  href="/blog/"
                  class="link ${data.activePage === 'blog' ? 'active' : ''}"
                  aria-current="${String(data.activePage === 'blog')}"
                  data-prefetch
                >
                  Blog
                </a>
                <a
                  href="/tags/"
                  class="link ${data.activePage === 'tags' ? 'active' : ''}"
                  aria-current="${String(data.activePage === 'tags')}"
                  data-prefetch
                >
                  Tags
                </a>
              </nav>

              <button
                id="theme-switch"
                class="theme-switch"
                role="switch"
                tabindex="0"
                title="Toggle dark mode"
                aria-label="Toggle dark mode"
                aria-checked="false"
              >
                <div class="icon sun"></div>
                <div class="icon moon"></div>
              </button>
            </header>

            <main>${data.content}</main>
          </div>
          <script src="/assets/js/index.js"></script>
        </body>
      </html>
    `,
  };
};

export default layout;
