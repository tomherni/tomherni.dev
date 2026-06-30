import type { Page } from '@types';
import { html } from '../../utils/render';
import { tagList } from '../../includes/tag-list';

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
