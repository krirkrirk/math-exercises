/**
 * @returns random [[a, b[[
 */

import { round } from "../round";

export const randfloat = (
  a: number,
  b?: number,
  roundTo?: number,
  excludes?: number[],
): number => {
  if (b === undefined) return Math.random() * a;
  if (roundTo === undefined) return a + Math.random() * (b - a);
  if (excludes?.length) {
    let res = 0;
    do {
      res = round(a + Math.random() * (b - a), roundTo);
    } while (excludes.includes(res));
    return res;
  }
  return round(a + Math.random() * (b - a), roundTo);
};
