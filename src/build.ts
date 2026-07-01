import fs from 'node:fs';
import { createAtomFeed } from './generator/feeds/create-atom-feed';
import { createRssFeed } from './generator/feeds/create-rss-feed';
import { createSitemap } from './generator/feeds/create-sitemap';
import { optimize } from './generator/optimize/optimize';
import { getPosts } from './generator/posts/get-posts';
import { renderPages } from './generator/render-pages/render-pages';
import { copySourceToTarget } from './utils/node';
import { DIR_DIST, DIR_SRC_STATIC } from './constants';

async function build() {
  // Prepare the DIST directory.
  fs.rmSync(DIR_DIST, { recursive: true, force: true });
  fs.mkdirSync(DIR_DIST);

  // Copy the content to DIST.
  copySourceToTarget(DIR_SRC_STATIC, DIR_DIST);

  // Collect all blog posts and tags.
  const posts = getPosts();
  const tags = [...new Set(posts.map((post) => post.meta.tags || []).flat())];

  // Create the HTML pages.
  const pages = await renderPages(posts, tags);

  // Optimize HTML pages and assets.
  await optimize();

  // Create feeds.
  createAtomFeed(posts);
  createRssFeed(posts);
  createSitemap(pages);
}

await build();
