import path from 'node:path';
import { ImportedPageData, RenderedPages } from '../../../types/types';
import { formatDateIso } from '../../utils/format';
import { html, map } from '../../utils/render';
import { DIR_DIST } from '../constants';
import { getState } from '../state';
import { createFile } from '../utils';

function pagesToSitemapEntries(pages: ImportedPageData[]): string {
  return map(pages, ({ url, config }) => {
    const date = config?.updated || config?.date || getState().build.buildDate;
    return html`
      <url>
        <loc>${url}</loc>
        <lastmod>${formatDateIso(date)}</lastmod>
      </url>
    `;
  });
}

export function createSitemap(pages: RenderedPages): void {
  const { content, posts, tags } = pages;

  // It is important there is no whitespace before the XML tag.
  const contents = html`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pagesToSitemapEntries([
        ...content.filter((page) => !page.config.excludeFromSitemap),
        ...posts,
        ...tags,
      ])}
    </urlset>`.trim();

  createFile(path.join(DIR_DIST, 'sitemap.xml'), contents);
}
