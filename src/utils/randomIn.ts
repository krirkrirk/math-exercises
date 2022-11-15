export function randomIn<t>(array: t[]) {
  return array[Math.floor(Math.random() * array.length)];
}
