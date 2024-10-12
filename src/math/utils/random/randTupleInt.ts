import { arrayEqual } from "#root/utils/arrays/arrayEqual";
import { randint } from "./randint";

interface randTupleIntOptions {
  from: number;
  to?: number;
  excludes?: number[];
  allDifferent?: boolean;
}

/**
 * @param size tuple length
 * @param options
 * @returns array of size "size" with elements = randint(from, to, exxcludes)
 */
export const randTupleInt = (
  size: number,
  options: randTupleIntOptions,
): number[] => {
  const res: number[] = [];
  for (let i = 0; i < size; i++) {
    let x: number;
    do {
      x = randint(options.from, options.to, options.excludes);
    } while (options.allDifferent && res.includes(x));
    res.push(x);
  }
  return res;
};

export const distinctRandTupleInt = (
  nb: number,
  size: number,
  options: randTupleIntOptions,
): number[][] => {
  const res: number[][] = [];
  for (let i = 0; i < nb; i++) {
    let newTuple: number[];
    do {
      newTuple = randTupleInt(size, options);
    } while (res.some((tuple) => arrayEqual(tuple, newTuple)));
    res.push(newTuple);
  }
  return res;
};
