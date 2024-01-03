import { Page } from '../../../types/types';
import { html } from '../../utils/render';

const page: Page = {
  config: () => ({
    layout: 'base',
    excludeFromSitemap: true,
  }),
  content: () => html`
    <div class="page">
      <h1>Page not found</h1>

      <p>
        Oops, the page you tried to visit does not exist (anymore). Sorry about
        that. Maybe you can find what you were looking for on my
        <a href="/blog/">Blog</a>.
      </p>
    </div>
  `,
};

export default page;
