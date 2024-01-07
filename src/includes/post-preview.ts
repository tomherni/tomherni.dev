import { Post } from '../../types/types';
import { formatDateShort, formatDateIso } from '../utils/format';
import { html, when } from '../utils/render';
import { tagList } from './tag-list';

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
    ${showParagraphWithDate(post)}
    ${when(post.meta.tags, () => tagList(post.meta.tags!, { condensed: true }))}
  </article>
`;
