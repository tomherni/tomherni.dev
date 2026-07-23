import type { Post } from '#types';
import path from 'node:path';
import { html, map } from '../../utils/html.js';
import { createFile } from '../../utils/node.js';
import { AUTHOR, BUILD, TITLE } from '../../config.js';
import { DIR_DIST } from '../../constants.js';

const FILE_NAME = 'rss.xml';

export async function createRssFeed(posts: Post[]): Promise<void> {
  const fileHref = new URL(FILE_NAME, BUILD.baseUrl).href;
  const buildDate = BUILD.date.toUTCString();

  // It is important there is no whitespace before the XML tag.
  const contents = html`<?xml version="1.0" encoding="utf-8"?>
    <rss
      version="2.0"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:atom="http://www.w3.org/2005/Atom"
    >
      <channel>
        <title>Posts on ${TITLE}</title>
        <link>${BUILD.baseUrl}</link>
        <atom:link href="${fileHref}" rel="self" type="application/rss+xml" />
        <description>Blog posts written by Tom Herni</description>
        <language>en-US</language>
        <category>Front-end</category>
        <category>Development</category>
        <category>Web</category>
        <lastBuildDate>${buildDate}</lastBuildDate>
        ${map(posts, (post) => {
          const date = post.meta.date.toUTCString();
          return html`
            <item>
              <title>${post.meta.title}</title>
              <link>${post.meta.url}</link>
              <guid>${post.meta.url}</guid>
              <pubDate>${date}</pubDate>
              <description>${post.meta.description}></description>
              <content:encoded><![CDATA[${post.content}]]></content:encoded>
              <author>${AUTHOR.email} (${AUTHOR.name})</author>
              <enclosure url="${post.meta.socialUrl}" length="0" type="image/jpg"/>
            </item>
          `;
        })}
      </channel>
    </rss>
  `;

  await createFile(path.join(DIR_DIST, FILE_NAME), contents);
}
