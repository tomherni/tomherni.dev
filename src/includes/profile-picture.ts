import { html } from '../utils/render';

export const profilePicture = () => html`
  <div class="profile-picture">
    <picture>
      <source srcset="/assets/img/picture.webp" type="image/webp" />
      <img
        loading="lazy"
        src="/assets/img/picture.png"
        width="150"
        height="150"
        alt="Picture of Tom sitting outside and smiling. He is happy you're here!"
      />
    </picture>
  </div>
`;
