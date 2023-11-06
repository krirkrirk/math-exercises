export const probaLawFlip = <T>(arr: [T, number][]) => {
  if (Math.abs(arr.reduce((acc, curr) => (acc += curr[1]), 0) - 1) > 0.1) throw Error('proba law does not add up t 1');
  const rand = Math.random();
  const sorted = [...arr].sort((a, b) => b[1] - a[1]);
  let probaAcc = 0;
  let i = 0;
  while (i < arr.length - 1) {
    probaAcc += sorted[i][1];
    if (rand < probaAcc) return arr[i][0];
    i++;
  }
  return arr[arr.length - 1][0];
};
