import type { Layout, Page, PageData, Post, RenderedPages } from '#types';
import path from 'node:path';
import postLayout from '../layouts/post.js';
import tagLayout from '../layouts/tag.js';
import { createFile, findFilesByExtension } from '../utils/node.js';
import { BUILD } from '../config.js';
import { DIR_DIST, DIR_SRC_STATIC } from '../constants.js';
import { createSocialImage } from './social-image/create-social-image.js';

export async function renderPages(
  posts: Post[],
  tags: string[],
): Promise<RenderedPages> {
  const tsFiles = await findFilesByExtension('ts', DIR_SRC_STATIC);
  const [content, _posts, _tags] = await Promise.all([
    Promise.all(tsFiles.map((file) => renderContentPage(file, posts, tags))),
    Promise.all(posts.map((post) => renderPostPage(post, posts, tags))),
    Promise.all(tags.map((tag) => renderTagPage(tag, posts, tags))),
  ]);
  return { content, posts: _posts, tags: _tags };
}

export async function renderContentPage(
  file: string,
  posts: Post[],
  tags: string[],
): Promise<PageData> {
  const layout = (await import(file)).default as Page;
  const target = resolveSrcDirToDistDir(file).replace('.ts', '.html');
  const data: PageData = { url: resolveUrl(target), posts, tags };
  return renderPage(target, layout, data);
}

async function renderPostPage(
  post: Post,
  posts: Post[],
  tags: string[],
): Promise<PageData> {
  const target = resolveSrcDirToDistDir(post.file).replace('.md', '.html');
  const data: PageData = {
    url: resolveUrl(target),
    posts,
    tags,
    post,
    content: post.content,
  };

  const [page] = await Promise.all([
    renderPage(target, postLayout, data),
    createSocialImage(post, target),
  ]);

  return page;
}

function renderTagPage(
  tag: string,
  posts: Post[],
  tags: string[],
): Promise<PageData> {
  const target = path.join(DIR_DIST, `/tags/${tag}/index.html`);
  const data: PageData = { url: resolveUrl(target), posts, tags, tag };
  return renderPage(target, tagLayout, data);
}

async function renderPage(
  target: string,
  pageOrLayout: Page | Layout,
  data: PageData,
): Promise<PageData> {
  const result = pageOrLayout(data);
  if (!result.content) {
    throw new Error('No content');
  }
  await createFile(target, result.content);
  return result;
}

function resolveSrcDirToDistDir(file: string): string {
  return path.join(DIR_DIST, path.relative(DIR_SRC_STATIC, file));
}

function resolveUrl(file: string): string {
  const relativePath = path.relative(DIR_DIST, file);
  const relativeUrl = path.normalize(path.dirname(relativePath) + '/');
  return new URL(relativeUrl, BUILD.baseUrl).href;
}
