import type { Page } from '@types';
import { getState } from '../../generator/state';
import { html } from '../../utils/render';
import { tagList } from '../../includes/tag-list';

const page: Page = {
  config: () => ({
    layout: 'base',
    title: 'Tags',
    activePage: 'tags',
  }),
  content: () => html`
    <div class="page">
      <h1>Tags</h1>

      ${tagList(getState().tags)}
    </div>
  `,
};

export default page;
