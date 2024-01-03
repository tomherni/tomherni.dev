import { html, map } from '../utils/render';

type TagListOptions = {
  condensed?: boolean;
};

function getTagContents(tag: string): string {
  return html`
    <span class="hashtag" aria-hidden="true">#</span
    ><!-- no space! --><span class="link-effect">${tag}</span>
  `;
}

export const tagList = (tags: string[], options: TagListOptions = {}) => html`
  <ul
    class="${options.condensed ? 'tag-list condensed' : 'tag-list'}"
    aria-label="Tags"
  >
    ${map(
      tags.sort((a, b) => a.localeCompare(b)),
      (tag) => html`
        <li>
          <a href="/tags/${tag}/">${getTagContents(tag)}</a>
        </li>
      `,
    )}
  </ul>
`;
