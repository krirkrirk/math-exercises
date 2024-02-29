/**
 * @returns random [[a, b[[
 */

export const randint = (a: number, b?: number, excludes?: number[]): number => {
  if (b === undefined) return Math.floor(Math.random() * a);
  if (!excludes) return a + Math.floor(Math.random() * (b - a));
  let res;
  do {
    res = a + Math.floor(Math.random() * (b - a));
  } while (excludes.includes(res));
  return res;
};
