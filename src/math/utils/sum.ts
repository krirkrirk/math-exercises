/**
 *
 * @param from included
 * @param to included
 * @param exec
 */

export const sum = (from: number, to: number, exec: (i: number) => number) => {
  let sum = 0;
  for (let i = from; i < to + 1; i++) {
    sum += exec(i);
  }
  return sum;
};
