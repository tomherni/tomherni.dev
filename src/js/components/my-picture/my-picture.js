import { renderStylesToShadowRoot } from '../../utils/styles.js';
import styles from './my-picture.css';

export class MyPicture extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <div class="🐸">
        <picture>
          <source srcset="./img/picture.webp" type="image/webp" />
          <img
            src="./img/picture.png"
            width="150"
            height="150"
            alt="Picture of Tom sitting outside and smiling. He is happy you're here!"
          />
        </picture>
      </div>
    `;

    renderStylesToShadowRoot(this.shadowRoot, styles);
  }
}
