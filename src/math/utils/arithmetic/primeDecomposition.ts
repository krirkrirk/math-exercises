import { primeFactors } from "./primeFactors";

export const primeDecomposition = (n: number) => {
  const factors = primeFactors(n);
  const res: { value: number; power: number }[] = [];
  for (const factor of factors) {
    const data = res.find((el) => el.value === factor);
    if (data) {
      data.power++;
    } else {
      res.push({
        value: factor,
        power: 1,
      });
    }
  }
  return res;
};
