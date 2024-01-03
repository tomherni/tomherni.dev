import path from 'path';
import url from 'url';
import { html, map } from '../../utils/render';
import { DIR_DIST } from '../constants';
import { getState } from '../state';
import { createFile } from '../utils';

const FILE_NAME = 'rss.xml';

export function createRssFeed(): void {
  const { build, config } = getState();
  const fileHref = url.resolve(build.baseUrl, FILE_NAME);
  const buildDate = build.buildDate.toUTCString();

  // It is important there is no whitespace before the XML tag.
  const contents = html`<?xml version="1.0" encoding="utf-8"?>
    <rss
      version="2.0"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:atom="http://www.w3.org/2005/Atom"
    >
      <channel>
        <title>Posts on ${config.title}</title>
        <link>${build.baseUrl}</link>
        <atom:link href="${fileHref}" rel="self" type="application/rss+xml" />
        <description>Blog posts written by Tom Herni</description>
        <language>en-US</language>
        <category>Front-end</category>
        <category>Development</category>
        <category>Web</category>
        <lastBuildDate>${buildDate}</lastBuildDate>
        ${map(getState().posts, (post) => {
          const date = post.meta.date.toUTCString();
          return html`
            <item>
              <title>${post.meta.title}</title>
              <link>${post.meta.url}</link>
              <guid>${post.meta.url}</guid>
              <pubDate>${date}</pubDate>
              <description>${post.meta.description}></description>
              <content:encoded><![CDATA[${post.content}]]></content:encoded>
              <author>${config.author.email} (${config.author.name})</author>
              <enclosure url="${post.meta.socialUrl}" length="0" type="image/jpg"/>
            </item>
          `;
        })}
      </channel>
    </rss>
  `;

  createFile(path.join(DIR_DIST, FILE_NAME), contents);
}
