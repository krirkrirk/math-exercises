export const average = (arr: number[]) => {
  if (!arr.length) return 0;
  return arr.reduce((acc, curr) => acc + curr) / arr.length;
};
