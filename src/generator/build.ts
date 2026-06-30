import fs from 'node:fs';
import { getPosts } from './get-posts/get-posts';
import { createAtomFeed } from './feeds/create-atom-feed';
import { createRssFeed } from './feeds/create-rss-feed';
import { createSitemap } from './feeds/create-sitemap';
import { renderPages } from './render-pages/render-pages';
import { DIR_DIST, DIR_SRC_STATIC } from './constants';
import { optimize } from './optimize/optimize';
import { copySourceToTarget } from './utils';

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
