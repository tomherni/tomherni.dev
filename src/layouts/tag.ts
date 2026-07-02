import type { Layout, Post } from '@types';
import { postPreview } from '../includes/post-preview';
import { html, map } from '../utils/html';
import baseLayout from './base';

function findTaggedPosts(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.meta.tags?.includes(tag));
}

const layout: Layout = (data) => {
  const { posts, tag } = data;
  if (!tag) {
    throw new Error('"data.tag" is missing');
  }
  return baseLayout({
    ...data,
    title: `Tagged “${tag}”`,
    activePage: 'tags',
    content: html`
      <div class="page">
        <h1 class="special">
          <span>Posts tagged with</span> <span>“${tag}”</span>
        </h1>

        ${map(findTaggedPosts(posts, tag), (post) => postPreview(post))}
      </div>
    `,
  });
};

export default layout;
