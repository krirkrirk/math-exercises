import { primeDecomposition } from "./primeDecomposition";

/**
 *
 * @param n
 * eg for n = 36 will return 6^2
 * for n = 12 will return 2^2*3
 */
export const maxPowerDecomposition = (n: number) => {
  const decomposition = primeDecomposition(n);
  const res: { value: number; power: number }[] = [];
  for (const item of decomposition) {
    const { value, power } = item;
    const matchingPower = res.find((el) => el.power === power);
    if (matchingPower) {
      matchingPower.value *= value;
    } else {
      res.push(item);
    }
  }
  return res;
};
