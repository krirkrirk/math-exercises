export function lcd(a: number, b: number) {
  const max = Math.max(a, b);
  for (let i = max; i < a * b; i++) {
    if (i % a === 0 && i % b === 0) return i;
  }
  return a * b;
}
