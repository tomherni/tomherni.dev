import type { PageData } from '@types';
import { html } from '../utils/html';

export const siteHeader = (data: PageData) => html`
  <div class="site-header">
    <nav role="navigation" aria-label="Main navigation">
      <ul aria-label="Main navigation">
        <li>
          <a
            href="/"
            class="logo"
            aria-current="${String(data.activePage === 'home')}"
          >
            tomherni<span>.dev</span>
          </a>
        </li>
        <li>
          <a
            href="/blog/"
            class="${data.activePage === 'blog' ? 'link active' : 'link'}"
            aria-current="${String(data.activePage === 'blog')}"
          >
            Blog
          </a>
        </li>
        <li>
          <a
            href="/tags/"
            class="${data.activePage === 'tags' ? 'link active' : 'link'}"
            aria-current="${String(data.activePage === 'tags')}"
          >
            Tags
          </a>
        </li>
      </ul>
    </nav>

    <button
      id="theme-switch"
      class="theme-switch"
      role="switch"
      tabindex="0"
      title="Enable dark mode"
      aria-label="Enable dark mode"
      aria-checked="false"
    >
      <div class="icon sun"></div>
      <div class="icon moon"></div>
    </button>
  </div>
`;
