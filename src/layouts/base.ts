import type { Layout, PageData, Post } from '#types';
import { siteHeader } from '../includes/site-header.js';
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

  const date = data.date?.toISOString();
  const updated =
    data.updated?.toISOString() || date || BUILD.date.toISOString();

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
          <meta name="description" content="${metadata.description}" />
          <meta name="robots" content="index,follow" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link rel="canonical" href="${metadata.url}" />
          ${createOpenGraphTags(metadata)}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${metadata.title}" />
          <meta name="twitter:description" content="${metadata.description}" />
          <meta name="twitter:creator" content="@tomherni" />
          <meta name="twitter:image" content="${metadata.image}" />
          <meta name="twitter:image:alt" content="${metadata.image}" />
          <link rel="icon" href="/assets/img/favicon.ico" />
          <script>
            // Set up the theme before loading the CSS so that the correct
            // CSS properties can be used from the start.
            const theme =
              localStorage.getItem('color-scheme') ||
              (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light');
            document.documentElement.setAttribute('data-theme', theme);

            window._paths_ = {};
            /* Note: the build looks for "window._paths_.*" URLs to hash them. */
            window._paths_.lazyCss = '/assets/css/styles-lazy.css';
          </script>
          <link rel="stylesheet" href="/assets/css/styles.css" />
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
            ${siteHeader(data)}
            <main>${data.content}</main>
          </div>
          <script src="/assets/js/index.js"></script>
        </body>
      </html>
    `,
  };
};

export default layout;
