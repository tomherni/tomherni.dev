export const styles = `
  :host {
    display: inline;
  }

  a {
    display: inline;
    color: var(--color-highlight);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
    border-bottom: 0.3rem solid var(--color-highlight);
    transition: border-bottom-color 150ms;
    outline: none;
  }

  a:focus-visible {
    border-radius: 0.4rem;
    outline: 0.2rem solid var(--color-highlight);
    outline-offset: 0.2rem;
  }

  svg {
    display: inline;
    width: 2.3rem;
    height: 2.3rem;
    margin-right: 0.8rem;
    fill: var(--color-highlight);
  }

  /* Some devices (mostly Samsung) have their touchscreen set up as a trackpad
   (which implies hover capability), and need an additional (pointer) check. */
  @media (hover: hover) and (pointer: fine) {
    a:hover {
      border-bottom-color: transparent;
    }
  }
`;
