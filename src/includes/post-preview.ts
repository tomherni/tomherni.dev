import type { Post } from '#types';
import { formatDateIso, formatDateShort } from '../utils/date.js';
import { html, when } from '../utils/html.js';
import { tagList } from './tag-list.js';

function showParagraphWithDate(post: Post): string {
  return post.meta.descriptionWithHtml.replace(
    '<p>',
    (paragraphTag) => html`
      ${paragraphTag}
      <time datetime="${formatDateIso(post.meta.date)}">
        ${formatDateShort(post.meta.date)} —&nbsp;
      </time>
    `,
  );
}

export const postPreview = (post: Post) => html`
  <article class="post-preview">
    <header>
      <h2><a href="${post.meta.url}">${post.meta.title}</a></h2>
    </header>
    <div class="formatted-content">${showParagraphWithDate(post)}</div>
    ${when(post.meta.tags, () => tagList(post.meta.tags!, { condensed: true }))}
  </article>
`;
