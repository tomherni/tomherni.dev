import type { Page } from '#types';
import baseLayout from '../../layouts/base.js';
import { html } from '../../utils/html.js';

const page: Page = (data) =>
  baseLayout({
    ...data,
    activePage: 'home',
    content: html`
      <my-element>
        <template shadowrootmode="open">
          <h1>The answer is Rainbow Wombat</h1>
          <a href="/"><slot></slot></a>
        </template>
        Back to homepage
      </my-element>
    `,
  });

export default page;
