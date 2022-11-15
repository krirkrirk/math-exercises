export function add(nb: number) {
  return nb === 0 ? "" : `${nb > 0 ? "+" : ""}${nb}`;
}
