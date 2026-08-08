import type { Temporal } from '@js-temporal/polyfill';

export type PageData = {
  url: string;
  posts: Post[];
  tags: string[];
  content?: string;
  post?: Post;
  tag?: string;
  title?: string;
  description?: string;
  date?: Temporal.Instant;
  updated?: Temporal.Instant;
  activePage?: 'home' | 'blog' | 'tags';
  excludeFromSitemap?: boolean;
};

export type Page = (data: PageData) => PageData;
export type Layout = (data: PageData) => PageData;

export type ParsedFrontMatter = {
  title: string;
  date: Temporal.Instant;
  description?: string;
  tags?: string[];
  updated?: Temporal.Instant;
};

export type PostMetadata = {
  title: string;
  description: string;
  descriptionWithHtml: string;
  date: Temporal.Instant;
  timeToRead: number;
  url: string;
  socialUrl: string;
  tags?: string[];
  updated?: Temporal.Instant;
};

export type Post = {
  meta: PostMetadata;
  content: string;
  file: string;
};

export type RenderedPages = {
  content: PageData[];
  posts: PageData[];
  tags: PageData[];
};
