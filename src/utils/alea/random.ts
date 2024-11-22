export function random<t>(array: t[], excludes?: t[]) {
  if (excludes?.length) {
    const filtered = array.filter((t) => !excludes.includes(t));
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
  return array[Math.floor(Math.random() * array.length)];
}
