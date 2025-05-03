import fs from 'node:fs';
import { siteConfig } from '../config';
import { getPosts } from './get-posts/get-posts';
import { createAtomFeed } from './feeds/create-atom-feed';
import { createRssFeed } from './feeds/create-rss-feed';
import { createSitemap } from './feeds/create-sitemap';
import { renderPages } from './render-pages/render-pages';
import {
  BASE_URL_DEV,
  BASE_URL_PROD,
  DIR_DIST,
  DIR_SRC_PUBLIC,
} from './constants';
import { optimize } from './optimize/optimize';
import { setState } from './state';
import { copySourceToTarget } from './utils';

type PartialBuildConfig = {
  env: 'DEV' | 'PROD';
  baseUrl: string;
};

const config = {
  config: siteConfig,
  build: { ...getDeployInfo(), buildDate: new Date() },
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

function getDeployInfo(): PartialBuildConfig {
  const { CONTEXT, DEPLOY_PRIME_URL } = process.env;

  // Detect Netlify's Deploy Preview deployment.
  if (CONTEXT === 'deploy-preview' && DEPLOY_PRIME_URL) {
    return { baseUrl: DEPLOY_PRIME_URL, env: 'PROD' };
  }
  // Detect Netlify's production deployment.
  if (CONTEXT === 'production') {
    return { baseUrl: BASE_URL_PROD, env: 'PROD' };
  }
  // Ensure the build is not running in an unexpected Netlify environment.
  // The base URL would need to be verified first.
  if (typeof CONTEXT !== 'undefined') {
    throw new Error('Unknown build environment');
  }
  return { baseUrl: BASE_URL_DEV, env: 'DEV' };
}
