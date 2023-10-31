import { renderStylesToShadowRoot } from '../../utils/styles.js';
import styles from './theme-switch.css';

function renderTemplateToShadowRoot(shadowRoot) {
  shadowRoot.innerHTML = `
    <div class="switch">
      <div class="icon sun"></div>
      <div class="icon moon"></div>
      <div class="handle"></div>
    </div>
  `;
}

export class ThemeSwitch extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    renderTemplateToShadowRoot(this.shadowRoot);
    renderStylesToShadowRoot(this.shadowRoot, styles);

    // Set up host attributes.
    this.setAttribute('role', 'switch');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-label', 'Enable dark mode');

    // Set up host event listeners.
    this.addEventListener('click', () => this.toggleTheme());
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        this.toggleTheme();
      }
    });
  }

  connectedCallback() {
    // Set the initial state.
    this.updateCheckedState(this.getCurrentTheme());

    // Enable a smooth theme transition only after the initial theme is applied.
    // Otherwise, the transition from browser defaults to the theme gets animated.
    requestAnimationFrame(() => {
      document.body.style.transition =
        'color var(--theme-transition-duration), background-color var(--theme-transition-duration)';
    });
  }

  toggleTheme() {
    this.setTheme(this.getCurrentTheme() === 'light' ? 'dark' : 'light');
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateCheckedState(theme);
  }

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme');
  }

  updateCheckedState(theme) {
    if (theme === 'light') {
      this.setAttribute('aria-checked', 'false');
      this.removeAttribute('checked');
    } else {
      this.setAttribute('aria-checked', 'true');
      this.setAttribute('checked', '');
    }
  }
}
