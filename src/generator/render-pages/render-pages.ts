import type {
  BasePageData,
  ImportedPageData,
  LayoutPostData,
  LayoutTagData,
  Post,
  RenderedPages,
} from '@types';
import path from 'node:path';
import { createSocialImage } from '../social-image/create-social-image';
import { DIR_DIST, DIR_SRC_STATIC } from '../constants';
import { findFilesByExtension, getLayoutPath, resolveUrl } from '../utils';
import { renderPage } from './render-page';

export async function renderPages(
  posts: Post[],
  tags: string[],
): Promise<RenderedPages> {
  const tsFiles = findFilesByExtension('ts', DIR_SRC_STATIC);
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
): Promise<ImportedPageData> {
  const target = resolveSrcDirToDistDir(file).replace('.ts', '.html');
  const data: BasePageData = { url: resolveUrl(target), posts, tags };
  return renderPage(file, target, data);
}

async function renderPostPage(
  post: Post,
  posts: Post[],
  tags: string[],
): Promise<ImportedPageData> {
  const layout = getLayoutPath('post');
  const target = resolveSrcDirToDistDir(post.file).replace('.md', '.html');
  const data: LayoutPostData = {
    url: resolveUrl(target),
    posts,
    tags,
    post,
    content: post.content,
  };

  const [page] = await Promise.all([
    renderPage(layout, target, data),
    createSocialImage(post, target),
  ]);

  return page;
}

async function renderTagPage(
  tag: string,
  posts: Post[],
  tags: string[],
): Promise<ImportedPageData> {
  const layout = getLayoutPath('tag');
  const target = path.join(DIR_DIST, `/tags/${tag}/index.html`);
  const data: LayoutTagData = { url: resolveUrl(target), posts, tags, tag };
  return renderPage(layout, target, data);
}

function resolveSrcDirToDistDir(file: string): string {
  return path.join(DIR_DIST, path.relative(DIR_SRC_STATIC, file));
}
