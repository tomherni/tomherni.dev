import type { Post, LayoutTag } from '@types';
import { postPreview } from '../includes/post-preview';
import { html, map } from '../utils/html';

function findTaggedPosts(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.meta.tags?.includes(tag));
}

const layout: LayoutTag = {
  config: ({ tag }) => ({
    layout: 'base',
    title: `Tagged “${tag}”`,
    activePage: 'tags',
  }),
  content: ({ posts, tag }) => html`
    <div class="page">
      <h1 class="special">
        <span>Posts tagged with</span> <span>“${tag}”</span>
      </h1>

      ${map(findTaggedPosts(posts, tag), (post) => postPreview(post))}
    </div>
  `,
};

export default layout;
