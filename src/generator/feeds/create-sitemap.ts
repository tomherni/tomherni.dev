import type { ImportedPageData, RenderedPages } from '@types';
import path from 'node:path';
import { formatDateIso } from '../../utils/date';
import { html, map } from '../../utils/html';
import { createFile } from '../../utils/node';
import { BUILD } from '../../config';
import { DIR_DIST } from '../../constants';

function pagesToSitemapEntries(pages: ImportedPageData[]): string {
  return map(pages, ({ url, config }) => {
    const date = config?.updated || config?.date || BUILD.date;
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
