/**
 * exp [[1,2],[3],[4,5]] donnera [[1,3,4], [1,3,5], [2,3,4],[2,3,5]]
 * @param arr
 * @returns
 */
export function getCartesiansProducts<T>(arr: T[][]) {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const currentRes = [...res];
    for (let j = 0; j < arr[i].length; j++) {
      if (i === 0) res.push([arr[i][j]]);
      else {
        if (j === 0) {
          currentRes.forEach((el) => el.push(arr[i][j]));
        } else {
          currentRes.forEach((el) =>
            res.push([...el.slice(0, el.length - 1), arr[i][j]]),
          );
        }
      }
    }
  }
  return res;
}

/**
 * exp [[1], [[5, 5], 6], [7, [8, 9]]]  -> [1,5,5,7] [1,5,5,8,9] [1,6,7] [1,6,8,9]
 * @param arr
 * @returns
 */
export function getFlatCartesianProducts<T>(arr: (T | T[])[][]) {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const currentRes = [...res];
    for (let j = 0; j < arr[i].length; j++) {
      const isArray = Array.isArray(arr[i][j]);
      const eltToArray: T[] = isArray
        ? (arr[i][j] as T[])
        : ([arr[i][j]] as T[]);

      if (i === 0) res.push([...eltToArray]);
      else {
        if (j === 0) {
          res.forEach((el) => el.push(...eltToArray));
        } else {
          const isPrevArray = Array.isArray(arr[i][0]);
          const prevEltToArray: T[] = isPrevArray
            ? (arr[i][0] as T[])
            : ([arr[i][0]] as T[]);
          currentRes.forEach((el) =>
            res.push([
              ...el.slice(0, el.length - prevEltToArray.length),
              ...eltToArray,
            ]),
          );
        }
      }
    }
  }
  return res;
}
