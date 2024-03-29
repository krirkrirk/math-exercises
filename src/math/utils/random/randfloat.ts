/**
 * @returns random [[a, b[[
 */

import { round } from "../round";

export const randfloat = (a: number, b?: number, roundTo?: number): number => {
  if (b === undefined) return Math.random() * a;
  if (roundTo === undefined) return a + Math.random() * (b - a);
  return round(a + Math.random() * (b - a), roundTo);
};
