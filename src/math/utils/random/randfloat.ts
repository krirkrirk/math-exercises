/**
 * @returns random [[a, b[[
 */

export const randfloat = (
  a: number,
  b?: number,
  excludes?: number[],
): number => {
  if (b === undefined) return Math.random() * a;
  if (!excludes) return a + Math.random() * (b - a);
  let res;
  do {
    res = a + Math.random() * (b - a);
  } while (excludes.includes(res));
  return res;
};
