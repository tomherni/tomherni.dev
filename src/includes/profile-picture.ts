import { html } from '../utils/html.js';

export const profilePicture = () => html`
  <div class="profile-picture">
    <img
      loading="lazy"
      src="/assets/img/picture.webp"
      width="150"
      height="150"
      alt="Picture of Tom sitting outside and smiling. He is happy you're here!"
    />
  </div>
`;
