export type PageData = {
  url: string;
  posts: Post[];
  tags: string[];
  content?: string;
  post?: Post;
  tag?: string;
  title?: string;
  description?: string;
  date?: Date;
  updated?: Date;
  activePage?: 'home' | 'blog' | 'tags';
  excludeFromSitemap?: boolean;
};

export type Page = (data: PageData) => PageData;
export type Layout = (data: PageData) => PageData;

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

export type RenderedPages = {
  content: PageData[];
  posts: PageData[];
  tags: PageData[];
};
