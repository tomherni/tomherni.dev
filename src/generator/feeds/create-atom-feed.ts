import type { Post } from '@types';
import path from 'node:path';
import { encodeHtml } from '../../utils/format';
import { html, map } from '../../utils/render';
import { AUTHOR, BUILD, TITLE } from '../../config';
import { DIR_DIST } from '../../constants';
import { createFile } from '../utils';

const FILE_NAME = 'atom.xml';

export function createAtomFeed(posts: Post[]): void {
  const fileHref = new URL(FILE_NAME, BUILD.baseUrl).href;

  // It is important there is no whitespace before the XML tag.
  const contents = html`<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${TITLE}</title>
      <link href="${new URL(fileHref, BUILD.baseUrl).href}" rel="self" />
      <link href="${BUILD.baseUrl}" />
      <updated>${BUILD.date.toISOString()}</updated>
      <id>${BUILD.baseUrl}</id>
      <author>
        <name>${AUTHOR.name}</name>
        <email>${AUTHOR.email}</email>
      </author>
      ${map(posts, (post) => {
        const date = post.meta.date.toISOString();
        const updated = post.meta.updated?.toISOString() || date;
        return html`
          <entry>
            <title>${post.meta.title}</title>
            <id>${post.meta.url}</id>
            <link href="${post.meta.url}" />
            <published>${date}</published>
            <updated>${updated}</updated>
            <summary>${post.meta.description}</summary>
            <content type="html">${encodeHtml(post.content)}</content>
          </entry>
        `;
      })}
    </feed>`;

  createFile(path.join(DIR_DIST, FILE_NAME), contents);
}
