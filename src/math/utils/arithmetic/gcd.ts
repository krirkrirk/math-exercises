function pgcd(a: number, b: number): number {
  return b ? pgcd(b, a % b) : Math.abs(a);
}

export function gcd(...args: number[]): number {
  if (args.length === 2) return pgcd(args[0], args[1]);
  else return gcd(args[0], gcd(...args.slice(1)));
}
