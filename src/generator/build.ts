import fs from 'node:fs';
import path from 'node:path';
import { siteConfig } from '../config';
import { getPosts } from './get-posts/get-posts';
import { createAtomFeed } from './feeds/create-atom-feed';
import { createRssFeed } from './feeds/create-rss-feed';
import { createSitemap } from './feeds/create-sitemap';
import { renderPages } from './render-pages/render-pages';
import { DIR_DIST, DIR_SRC_PUBLIC } from './constants';
import { optimize } from './optimize/optimize';
import { setState } from './state';

type PartialBuildConfig = {
  env: 'DEV' | 'PROD';
  baseUrl: string;
};

export async function build(buildConfig: PartialBuildConfig): Promise<void> {
  const config = {
    config: siteConfig,
    build: { ...buildConfig, buildDate: new Date() },
  };

  // Prepare the DIST directory.
  fs.rmSync(DIR_DIST, { recursive: true, force: true });
  fs.mkdirSync(DIR_DIST);

  // Copy the content to DIST.
  copySourceToTarget(DIR_SRC_PUBLIC, DIR_DIST);

  // Prepare the site data object to be able to create HTML pages.
  const posts = getPosts(config.build);
  const tags = [...new Set(posts.map((post) => post.meta.tags || []).flat())];
  setState({ ...config, posts, tags });

  // Create the HTML pages.
  const pages = await renderPages();

  // Optimize HTML pages and assets.
  await optimize();

  // Create feeds.
  createAtomFeed();
  createRssFeed();
  createSitemap(pages);
}

/**
 * Copy the source directory to the target directory.
 */
function copySourceToTarget(source: string, target: string): void {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copySourceToTarget(sourcePath, targetPath);
    } else if (!['.md', '.ts'].includes(path.extname(sourcePath))) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
