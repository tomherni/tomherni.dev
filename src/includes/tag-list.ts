import { html, map } from '../utils/html.js';

type TagListOptions = {
  condensed?: boolean;
};

export const tagList = (tags: string[], options: TagListOptions = {}) => html`
  <ul
    class="${options.condensed ? 'tag-list condensed' : 'tag-list'}"
    aria-label="Tags"
  >
    ${map(
      tags.sort((a, b) => a.localeCompare(b)),
      (tag) => html`
        <li>
          <a href="/tags/${tag}/">
            <span class="hashtag" aria-hidden="true">#</span
            ><!-- no space! --><span class="link-effect">${tag}</span>
          </a>
        </li>
      `,
    )}
  </ul>
`;
