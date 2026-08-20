import type { ParsedFrontMatter, Post } from '#types';
import { promises as fs } from 'node:fs';
import { Temporal } from '@js-temporal/polyfill';
import { load } from 'js-yaml';
import { convert } from 'quote-quote';
import { findFilesByExtension } from '../../utils/node.js';
import { isObject } from '../../utils/object.js';
import { DIR_SRC_STATIC } from '../../constants.js';
import { getMetadata } from './get-metadata.js';
import { parseMarkdown } from './parse-markdown.js';

// Markdown front matter is at the top of the file between triple-dashed lines.
const frontMatterRegex = /^---([\s\S]*?)---/;

// Verify a string is in the format of `yyyy-mm-dd hh:mm:ss`.
const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

/**
 * Return all Markdown files transformed to posts.
 */
export async function getPosts(): Promise<Post[]> {
  const mdFiles = await findFilesByExtension('md', DIR_SRC_STATIC);
  const result = await Promise.all(
    mdFiles.map((file) => transformMarkdownFileToPost(file)),
  );
  return result.sort((a, b) =>
    Temporal.Instant.compare(b.meta.date, a.meta.date),
  );
}

async function transformMarkdownFileToPost(file: string): Promise<Post> {
  const mdFileContent = await fs.readFile(file, 'utf-8');

  // Important to format contents before extracting front matter. The front
  // matter may need to be formatted as well (like the description).
  const contents = convert(mdFileContent, { ellipsis: true });

  const frontMatter = parseFrontMatter(contents.match(frontMatterRegex)?.[1]);
  const contentWithoutFrontMatter = contents.replace(frontMatterRegex, '');
  const parsedContent = await parseMarkdown(contentWithoutFrontMatter, file);

  return {
    content: parsedContent,
    meta: getMetadata(parsedContent, frontMatter, file),
    file,
  };
}

function parseFrontMatter(rawFm: string | undefined): ParsedFrontMatter {
  if (rawFm) {
    const fm = load(rawFm);

    if (
      isObject(fm) &&
      'title' in fm &&
      'date' in fm &&
      dateTimeRegex.test(fm.date as string) &&
      (!('tags' in fm) || isValidTags(fm.tags))
    ) {
      fm.date = stringToUtcDateTime(fm.date as string);

      if ('updated' in fm && dateTimeRegex.test(fm.updated as string)) {
        fm.updated = stringToUtcDateTime(fm.updated as string);
      }

      return fm as ParsedFrontMatter;
    }
  }
  throw new Error('Invalid front matter');
}

function stringToUtcDateTime(fmTimestamp: string): Temporal.Instant {
  return Temporal.PlainDateTime.from(fmTimestamp.replace(' ', 'T'))
    .toZonedDateTime('UTC')
    .toInstant();
}

function isValidTags(tags: unknown): tags is string[] {
  return Array.isArray(tags) && tags.every((tag) => typeof tag === 'string');
}
