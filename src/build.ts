import { promises as fs } from 'node:fs';
import { createAtomFeed } from './build/feeds/create-atom-feed';
import { createRssFeed } from './build/feeds/create-rss-feed';
import { createSitemap } from './build/feeds/create-sitemap';
import { optimize } from './build/optimize';
import { getPosts } from './build/posts/get-posts';
import { renderPages } from './build/render-pages';
import { copySourceToTarget } from './utils/node';
import { DIR_DIST, DIR_SRC_STATIC } from './constants';

async function build() {
  // Prepare the DIST directory.
  await fs.rm(DIR_DIST, { recursive: true, force: true });
  await fs.mkdir(DIR_DIST);

  // Copy the content to DIST.
  await copySourceToTarget(DIR_SRC_STATIC, DIR_DIST);

  // Collect all blog posts and tags.
  const posts = await getPosts();
  const tags = [...new Set(posts.map((post) => post.meta.tags || []).flat())];

  // Create the HTML pages.
  const pages = await renderPages(posts, tags);

  // Optimize HTML pages and assets.
  await optimize();

  // Create feeds.
  await createAtomFeed(posts);
  await createRssFeed(posts);
  await createSitemap(pages);
}

await build();
