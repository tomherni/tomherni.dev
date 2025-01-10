import fs from 'node:fs';
import yamlToJs from 'js-yaml';
import { BuildConfig, ParsedFrontMatter, Post } from '../../../types/types';
import { DIR_SRC_PUBLIC } from '../constants';
import { findFilesByExtension, isObject } from '../utils';
import { formatMarkdown } from './format-markdown';
import { getMetadata } from './get-metadata';
import { parseMarkdown } from './parse-markdown';

// Markdown front matter is at the top of the file between triple-dashed lines.
const frontMatterRegex = /^---([\s\S]*?)---/;

/**
 * Return all Markdown files transformed to posts.
 */
export function getPosts(config: BuildConfig): Post[] {
  return findFilesByExtension('md', DIR_SRC_PUBLIC)
    .map((file) => transformMarkdownFileToPost(file, config))
    .sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime());
}

function transformMarkdownFileToPost(file: string, config: BuildConfig): Post {
  // Important to format contents before extracting front matter. The front
  // matter may need to be formatted as well (like the description).
  const contents = formatMarkdown(fs.readFileSync(file, 'utf-8'));
  const frontMatter = parseFrontMatter(contents.match(frontMatterRegex)?.[1]);
  const contentWithoutFrontMatter = contents.replace(frontMatterRegex, '');
  const parsedContent = parseMarkdown(contentWithoutFrontMatter, config);

  return {
    content: parsedContent,
    meta: getMetadata(parsedContent, frontMatter, file, config),
    file,
  };
}

function parseFrontMatter(fm: string | undefined): ParsedFrontMatter {
  if (fm) {
    const parsed = yamlToJs.load(fm);
    if (isValidFrontMatter(parsed)) {
      return parsed;
    }
  }
  throw new Error('Invalid front matter');
}

/**
 * Check if front matter has all required properties in the correct format. This
 * ensures data is complete, but also parsed as expected by `js-yaml`.
 */
function isValidFrontMatter(fm: unknown): fm is ParsedFrontMatter {
  return (
    isObject(fm) &&
    'title' in fm &&
    'date' in fm &&
    fm.date instanceof Date &&
    (!('tags' in fm) || isValidTags(fm.tags)) &&
    (!('updated' in fm) || fm.updated instanceof Date)
  );
}

function isValidTags(tags: unknown): tags is string[] {
  return Array.isArray(tags) && tags.every((tag) => typeof tag === 'string');
}
