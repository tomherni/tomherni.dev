/* Post */

export type ParsedFrontMatter = {
  title: string;
  date: Date;
  description?: string;
  tags?: string[];
  updated?: Date;
};

export type PostMetadata = {
  title: string;
  description: string;
  descriptionWithHtml: string;
  date: Date;
  timeToRead: number;
  url: string;
  socialUrl: string;
  tags?: string[];
  updated?: Date;
};

export type Post = {
  meta: PostMetadata;
  content: string;
  file: string;
};

/* Global */

export type PageConfig = {
  layout?: string;
  title?: string;
  description?: string;
  date?: Date;
  updated?: Date;
  activePage?: 'home' | 'blog' | 'tags';
  excludeFromSitemap?: boolean;
};

export type BasePageData = {
  url: string;
};

export type ImportedPageData = BasePageData & {
  config: PageConfig;
  content: string;
};

/* Page */

export type Page = {
  config: (data: BasePageData) => PageConfig;
  content: (data: BasePageData) => string;
};

/* Layouts & Data */

export type Layout = {
  config?: (data: ImportedPageData) => PageConfig;
  content: (data: ImportedPageData) => string;
};

export type BaseLayoutPostData = {
  post: Post;
  content: string;
};

export type LayoutPostData = BasePageData & BaseLayoutPostData;

export type LayoutPost = {
  config: (data: LayoutPostData) => PageConfig;
  content: (data: LayoutPostData) => string;
};

export type BaseLayoutTagData = {
  tag: string;
};

export type LayoutTagData = BasePageData & BaseLayoutTagData;

export type LayoutTag = {
  config: (data: LayoutTagData) => PageConfig;
  content: (data: LayoutTagData) => string;
};

export type BuildConfig = {
  baseUrl: string;
  env: 'DEV' | 'PROD';
  buildDate: Date;
};

export type SiteConfig = {
  title: string;
  description: string;
  author: {
    name: string;
    email: string;
  };
};

export type GlobalState = {
  build: BuildConfig;
  config: SiteConfig;
  posts: Post[];
  tags: string[];
};

export type RenderedPages = {
  content: ImportedPageData[];
  posts: ImportedPageData[];
  tags: ImportedPageData[];
};
