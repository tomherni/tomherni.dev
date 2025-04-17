import { convert } from 'quote-quote';

/**
 * Make content look better by replacing straight quotes with curly quotes,
 * and ellipses with smart ellipses.
 */
export function formatMarkdown(content: string): string {
  const blocks: string[] = [];
  const inlines: string[] = [];

  // Remove all code snippets (they shouldn't be formatted).
  const contentWithoutCode = content
    .replace(/```([\s\S]*?)```/g, (match) => {
      blocks.push(match);
      return '__CODE_BLOCK__';
    })
    .replace(/`([\s\S]*?)`/g, (match) => {
      inlines.push(match);
      return '__CODE_INLINE__';
    });

  // Add smart quotes and ellipses.
  const smartContent = convert(contentWithoutCode).replace(/\.\.\./g, '\u2026');

  // Add back the code snippets.
  const contentWithCode = smartContent
    .replace(/__CODE_INLINE__/g, () => {
      if (!inlines.length) {
        throw new Error('There are no more inline codes available');
      }
      return inlines.shift() as string;
    })
    .replace(/__CODE_BLOCK__/g, () => {
      if (!blocks.length) {
        throw new Error('There are no more code blocks available');
      }
      return blocks.shift() as string;
    });

  // Ensure all code snippets ended up back in the content.
  if (blocks.length || inlines.length) {
    throw new Error('Not all code blocks or inline codes were replaced');
  }

  return contentWithCode;
}
