import { Page } from '../../../types/types';
import { getState } from '../../generator/state';
import { html, map } from '../../utils/render';
import { postPreview } from '../../includes/post-preview';

const page: Page = {
  config: () => ({
    layout: 'base',
    title: 'Blog',
    activePage: 'blog',
  }),
  content: () => html`
    <div class="page">
      <h1 class="sr-only">Blog posts</h1>

      ${map(getState().posts, (post) => postPreview(post))}
    </div>
  `,
};

export default page;
