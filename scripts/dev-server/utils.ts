/**
 * Format a string to change the text color in the console. This uses ANSI
 * escape codes. Ref: https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
 */
function formatConsoleText(code: number, str: string): string {
  return `\x1b[${code}m${str}\x1b[0m`;
}

export const red = (str: string) => formatConsoleText(31, str);

export const green = (str: string) => formatConsoleText(32, str);

export const yellow = (str: string) => formatConsoleText(33, str);

export const cyan = (str: string) => formatConsoleText(36, str);

export const gray = (str: string) => formatConsoleText(37, str);

export function formatMs(ms: number): string {
  return yellow(`(${Math.round(ms)}ms)`);
}

export function log(message: string): void {
  const datetime = new Date().toISOString().slice(11, 19);
  console.log(`${gray(`[${datetime}]`)} ${message}`);
}
