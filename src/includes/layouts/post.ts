import { LayoutPost } from '../../../types/types';
import { formatDate, formatDateIso } from '../../utils/format';
import { html, when } from '../../utils/render';
import { profilePicture } from '../profile-picture';
import { tagList } from '../tag-list';

const layout: LayoutPost = {
  config: ({ post }) => ({
    layout: 'base',
    title: post.meta.title,
    description: post.meta.description,
    date: post.meta.date,
    updated: post.meta.updated,
    activePage: 'blog',
  }),
  content: ({ post, content }) => html`
    <div class="page-post">
      <article>
        <header>
          <h1>${post.meta.title}</h1>
          <div class="datetime">
            <time datetime="${formatDateIso(post.meta.date)}">
              ${formatDate(post.meta.date)}
            </time>
            &nbsp;&bull;&nbsp; ${post.meta.timeToRead} min read
          </div>
        </header>

        <div class="formatted-content">${content}</div>

        ${when(post.meta.tags, () => tagList(post.meta.tags!))}
      </article>

      <div class="author">
        <div class="picture">${profilePicture()}</div>
        <div class="description">
          <div class="name">Written by Tom Herni</div>
          <p>
            A front-end engineer passionate about designing and building
            creative solutions for the web.
          </p>
          <ul class="get-in-touch">
            <li>
              <a
                href="https://www.linkedin.com/in/tomherni"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="img">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="10 10 28 28"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path
                      d="M33.5 12h-19a2.507 2.507 0 00-2.5 2.5v19c0 1.375 1.125 2.5 2.5 2.5h19c1.375 0 2.5-1.125 2.5-2.5v-19c0-1.375-1.125-2.5-2.5-2.5zm-15 4.734a1.766 1.766 0 110 3.533 1.766 1.766 0 010-3.533zm1.594 14.474h-3.116v-10.24h3.116v10.24zm11.906 0h-3.111v-5.092c0-1.163-.023-2.657-1.619-2.657-1.621 0-2.204 1.266-2.204 2.573v5.176h-3.113v-10.24h2.988v1.369h.042c.416-.787 1.768-1.618 3.283-1.618 3.151 0 3.734 2.075 3.734 4.774v5.715z"
                    />
                  </svg>
                </div>
                <span class="link-effect">LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/tomherni"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="img">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path
                      d="M28,16.297a12.00154,12.00154,0,0,1-8.19942,11.38223c-.609.11718-.82514-.25609-.82514-.57691,0-.39338.01473-1.68736.01473-3.29126a2.86307,2.86307,0,0,0-.81468-2.22177c2.6733-.297,5.479-1.31121,5.479-5.92017A4.629,4.629,0,0,0,22.421,12.44971a4.30829,4.30829,0,0,0-.11941-3.17511s-1.0057-.3226-3.29666,1.2299a11.37652,11.37652,0,0,0-6.00842,0C10.70412,8.952,9.69658,9.2746,9.69658,9.2746a4.3144,4.3144,0,0,0-.11764,3.17511,4.6369,4.6369,0,0,0-1.23517,3.21937c0,4.59747,2.80132,5.62674,5.466,5.92952a2.56331,2.56331,0,0,0-.76186,1.60391,2.55528,2.55528,0,0,1-3.49232-.99687,2.52064,2.52064,0,0,0-1.83807-1.23639s-1.172-.01509-.08243.7293a3.1772,3.1772,0,0,1,1.33234,1.755s.70433,2.33328,4.04232,1.60826c.00582,1.00121.01621,1.7557.01621,2.04051,0,.31795-.219.68834-.819.57831A11.99877,11.99877,0,1,1,28,16.297Z"
                    />
                  </svg>
                </div>
                <span class="link-effect">GitHub</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
};

export default layout;
