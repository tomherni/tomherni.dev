import type { Page } from '@types';
import { postPreview } from '../../includes/post-preview';
import { html, map } from '../../utils/html';

const page: Page = {
  config: () => ({
    layout: 'base',
    title: 'Blog',
    activePage: 'blog',
  }),
  content: ({ posts }) => html`
    <div class="page">
      <h1 class="sr-only">Blog posts</h1>
      ${map(posts, (post) => postPreview(post))}
    </div>
  `,
};

export default page;
