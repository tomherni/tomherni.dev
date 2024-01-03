import path from 'path';
import {
  BaseLayoutPostData,
  BaseLayoutTagData,
  ImportedPageData,
  Post,
  RenderedPages,
} from '../../../types/types';
import { DIR_DIST, DIR_SRC_PUBLIC } from '../constants';
import { getState } from '../state';
import { findFilesByExtension, getLayoutPath } from '../utils';
import { createSocialImage } from './create-social-image';
import { renderPage } from './render-page';

export async function renderPages(): Promise<RenderedPages> {
  const tsFiles = findFilesByExtension('ts', DIR_SRC_PUBLIC);
  const [content, posts, tags] = await Promise.all([
    Promise.all(tsFiles.map(renderContentPage)),
    Promise.all(getState().posts.map(renderPostPage)),
    Promise.all(getState().tags.map(renderTagPage)),
  ]);
  return { content, posts, tags };
}

export async function renderContentPage(
  file: string,
): Promise<ImportedPageData> {
  const target = resolveSrcDirToDistDir(file).replace('.ts', '.html');
  return renderPage(file, target);
}

async function renderPostPage(post: Post): Promise<ImportedPageData> {
  const layout = getLayoutPath('post');
  const target = resolveSrcDirToDistDir(post.file).replace('.md', '.html');
  const data: BaseLayoutPostData = { post, content: post.content };

  const [page] = await Promise.all([
    renderPage(layout, target, data),
    createSocialImage(post, target),
  ]);

  return page;
}

async function renderTagPage(tag: string): Promise<ImportedPageData> {
  const layout = getLayoutPath('tag');
  const target = path.join(DIR_DIST, `/tags/${tag}/index.html`);
  const data: BaseLayoutTagData = { tag };
  return renderPage(layout, target, data);
}

function resolveSrcDirToDistDir(file: string): string {
  return path.join(DIR_DIST, path.relative(DIR_SRC_PUBLIC, file));
}
