function pgcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

export function gcd(...args: number[]): number {
  if (args.length === 2) return pgcd(args[0], args[1]);
  else return gcd(args[0], gcd(...args.slice(1)));
}
