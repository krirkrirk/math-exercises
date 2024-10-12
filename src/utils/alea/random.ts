export function random<t>(array: t[]) {
  return array[Math.floor(Math.random() * array.length)];
}
