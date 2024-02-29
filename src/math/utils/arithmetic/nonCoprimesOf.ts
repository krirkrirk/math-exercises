import { gcd } from "./gcd";

export const nonCoprimesOf = (nb: number) => {
  let nonCoprimes = [];
  for (let i = 1; i <= nb; i++) {
    if (gcd(nb, i) !== 1) nonCoprimes.push(i);
  }
  return nonCoprimes;
};
