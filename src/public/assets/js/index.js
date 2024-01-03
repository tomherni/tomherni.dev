'use strict';

// Load the non-critical styles.
const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', window._paths_.lazyCss);
document.head.append(link);

const themeSwitch = document.getElementById('theme-switch');

themeSwitch.addEventListener('click', () => toggleTheme());
themeSwitch.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleTheme();
  }
});

// Set the initial state.
updateCheckedState(getCurrentTheme());
themeSwitch.classList.add('loaded');
document.body.style.transition =
  'color var(--theme-transition-duration), background-color var(--theme-transition-duration)';

function toggleTheme() {
  setTheme(getCurrentTheme() === 'light' ? 'dark' : 'light');
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('color-scheme', theme);
  updateCheckedState(theme);
}

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme');
}

function updateCheckedState(theme) {
  if (theme === 'light') {
    themeSwitch.setAttribute('aria-checked', 'false');
    themeSwitch.removeAttribute('checked');
  } else {
    themeSwitch.setAttribute('aria-checked', 'true');
    themeSwitch.setAttribute('checked', '');
  }
}
