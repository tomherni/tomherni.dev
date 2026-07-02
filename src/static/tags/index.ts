import type { Page } from '@types';
import { tagList } from '../../includes/tag-list';
import baseLayout from '../../layouts/base';
import { html } from '../../utils/html';

const page: Page = (data) =>
  baseLayout({
    ...data,
    title: 'Tags',
    activePage: 'tags',
    content: html`
      <div class="page">
        <h1>Tags</h1>
        ${tagList(data.tags)}
      </div>
    `,
  });

export default page;
