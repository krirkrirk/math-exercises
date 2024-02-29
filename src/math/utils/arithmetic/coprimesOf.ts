import { gcd } from "./gcd";

export const coprimesOf = (nb: number) => {
  let coprimes = [];
  for (let i = 2; i <= nb; i++) {
    if (gcd(nb, i) === 1) coprimes.push(i);
  }
  return coprimes;
};
