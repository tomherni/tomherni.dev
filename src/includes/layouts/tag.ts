import { Post, LayoutTag } from '../../../types/types';
import { getState } from '../../generator/state';
import { html, map } from '../../utils/render';
import { postPreview } from '../post-preview';

function findTaggedPosts(tag: string): Post[] {
  return getState().posts.filter((post) => post.meta.tags?.includes(tag));
}

const layout: LayoutTag = {
  config: ({ tag }) => ({
    layout: 'base',
    title: `Tagged “${tag}”`,
    activePage: 'tags',
  }),
  content: ({ tag }) => html`
    <div class="page">
      <h1 class="special">
        <span>Posts tagged with</span> <span>“${tag}”</span>
      </h1>

      ${map(findTaggedPosts(tag), (post) => postPreview(post))}
    </div>
  `,
};

export default layout;
