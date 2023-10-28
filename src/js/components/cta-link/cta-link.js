import { renderStylesToShadowRoot } from '../../utils/styles.js';
import { styles } from './styles.js';

export class CtaLink extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <a href="https://www.linkedin.com/in/tomherni/" target="_blank" rel="noopener noreferrer">
        <svg viewBox="12 12 24 24" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M33.5,12h-19c-1.375,0-2.5,1.125-2.5,2.5v19c0,1.375,1.125,2.5,2.5,2.5h19c1.375,0,2.5-1.125,2.5-2.5 v-19C36,13.125,34.875,12,33.5,12z M18.5,16.734c0.975,0,1.766,0.791,1.766,1.766s-0.79,1.766-1.766,1.766 s-1.766-0.791-1.766-1.766S17.525,16.734,18.5,16.734z M20.094,31.208h-3.116v-10.24h3.116V31.208z M32,31.208h-3.111v-5.092 c0-1.163-0.023-2.657-1.619-2.657c-1.621,0-2.204,1.266-2.204,2.573v5.176h-3.113v-10.24h2.988v1.369h0.042 c0.416-0.787,1.768-1.618,3.283-1.618c3.151,0,3.734,2.075,3.734,4.774V31.208z"
          />
        </svg><!-- No space! --><slot></slot>
      </a>
    `;

    renderStylesToShadowRoot(this.shadowRoot, styles);
  }
}
