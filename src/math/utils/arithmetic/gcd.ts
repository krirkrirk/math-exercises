export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

export function multigcd(...args: number[]): number {
  if (args.length === 2) return gcd(args[0], args[1]);
  else return gcd(args[0], multigcd(...args.slice(1)));
}
