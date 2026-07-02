import type { Page } from '@types';
import { postPreview } from '../../includes/post-preview';
import baseLayout from '../../layouts/base';
import { html, map } from '../../utils/html';

const page: Page = (data) =>
  baseLayout({
    ...data,
    title: 'Blog',
    activePage: 'blog',
    content: html`
      <div class="page">
        <h1 class="sr-only">Blog posts</h1>
        ${map(data.posts, (post) => postPreview(post))}
      </div>
    `,
  });

export default page;
