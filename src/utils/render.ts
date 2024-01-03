/**
 * A template literal tag just so tooling (e.g. Prettier and ESLint) understands
 * a string contains HTML.
 */
export function html(strings: TemplateStringsArray, ...val: unknown[]): string {
  return strings.map((str, i) => str + (val[i] ?? '')).join('');
}

/**
 * Similar to `.map()` on an Array, but when inserting in the DOM directly it
 * will not leave commas behind between entries.
 */
export function map<T>(entries: T[], callback: (entry: T) => string): string {
  return entries.reduce((all, entry) => `${all} ${callback(entry)}`, '');
}

/**
 * A slightly more declarative way to render conditional content.
 */
export function when(
  condition: unknown,
  truthyContent: () => string,
  falsyContent?: () => string,
): string {
  return condition ? truthyContent() : falsyContent?.() || '';
}
