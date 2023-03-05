import { dividersOf } from "./dividersOf";

export const nonDivisorOf = (nb: number) => {
  let nonDividers = [];
  let dividers = dividersOf(nb);

  for (let i = 2; i < nb; i++) {
    if (nb % i !== 0) nonDividers.push(i);
  }

  return nonDividers;
};
