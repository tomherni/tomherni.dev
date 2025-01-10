import path from 'node:path';
import url from 'node:url';
import {
  BuildConfig,
  ParsedFrontMatter,
  PostMetadata,
} from '../../../types/types';
import { slugify } from '../../utils/format';
import { DIR_SRC_PUBLIC, SOCIAL_FILE_NAME } from '../constants';

export function getMetadata(
  content: string,
  fm: ParsedFrontMatter,
  file: string,
  config: BuildConfig,
): PostMetadata {
  const relativePath = path.dirname(path.relative(DIR_SRC_PUBLIC, file)) + '/';
  const _url = url.resolve(config.baseUrl, path.normalize(relativePath));
  const description = fm.description || content.split('\n').filter(Boolean)[0];

  // Some properties could be added by spreading `frontMatter`. But now there is
  // a clear overview of the properties and how they ended up in the metadata. It
  // also prevents overwriting properties that accidentally have the same name.
  return {
    title: fm.title,
    description: stripHtml(description),
    descriptionWithHtml: description,
    date: fm.date,
    updated: fm.updated,
    tags: fm.tags?.map((tag) => slugify(tag)),
    timeToRead: calculateTimeToRead(content),
    url: _url,
    socialUrl: url.resolve(_url, SOCIAL_FILE_NAME),
  };
}

/**
 * Calculate the time it takes to read a post.
 */
function calculateTimeToRead(content: string): number {
  const wordCount = stripHtml(content).match(/\b[\w'’-]+\b/g)?.length || 1;
  return Math.round(wordCount / 200) || 1;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}
