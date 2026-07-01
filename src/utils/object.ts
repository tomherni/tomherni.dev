export function isObject(arg: unknown): arg is object {
  return Object.prototype.toString.call(arg) === '[object Object]';
}
