import type { Page } from '@types';
import { profilePicture } from '../includes/profile-picture';
import { html } from '../utils/render';

const page: Page = {
  config: () => ({
    layout: 'base',
    activePage: 'home',
  }),
  content: () => html`
    <div class="page-home">
      ${profilePicture()}

      <h1>Hello! My name is <span>Tom</span>,</h1>

      <p>
        <span>and I&rsquo;m passionate about designing and</span>
        <span>building creative solutions for the web.</span>
      </p>
    </div>
  `,
};

export default page;
