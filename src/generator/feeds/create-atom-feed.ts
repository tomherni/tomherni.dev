import path from 'node:path';
import url from 'node:url';
import { encodeHtml } from '../../utils/format';
import { html, map } from '../../utils/render';
import { DIR_DIST } from '../constants';
import { getState } from '../state';
import { createFile } from '../utils';

const FILE_NAME = 'atom.xml';

export function createAtomFeed(): void {
  const { build, config } = getState();
  const fileHref = url.resolve(build.baseUrl, FILE_NAME);

  // It is important there is no whitespace before the XML tag.
  const contents = html`<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>${config.title}</title>
      <link href="${url.resolve(build.baseUrl, fileHref)}" rel="self" />
      <link href="${build.baseUrl}" />
      <updated>${build.buildDate.toISOString()}</updated>
      <id>${build.baseUrl}</id>
      <author>
        <name>${config.author.name}</name>
        <email>${config.author.email}</email>
      </author>
      ${map(getState().posts, (post) => {
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
