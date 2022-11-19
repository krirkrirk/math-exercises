export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
