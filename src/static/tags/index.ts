import type { Page } from '@types';
import { tagList } from '../../includes/tag-list';
import { html } from '../../utils/html';

const page: Page = {
  config: () => ({
    layout: 'base',
    title: 'Tags',
    activePage: 'tags',
  }),
  content: ({ tags }) => html`
    <div class="page">
      <h1>Tags</h1>
      ${tagList(tags)}
    </div>
  `,
};

export default page;
