export function permute<T>(arr: T[]) {
  const result: T[][] = [];
  if (arr.length === 0) return [];
  if (arr.length === 1) return [arr];
  for (let i = 0; i < arr.length; i++) {
    const currentNum = arr[i];
    const remainingNums = arr.slice(0, i).concat(arr.slice(i + 1));
    const remainingNumsPermuted = permute(remainingNums);
    for (let j = 0; j < remainingNumsPermuted.length; j++) {
      const permutedArray = [currentNum].concat(remainingNumsPermuted[j]);
      result.push(permutedArray);
    }
  }
  return result;
}
