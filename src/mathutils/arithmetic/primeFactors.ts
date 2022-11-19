/***
 * returns array of prime factors
 * e.g 12 -> [2, 2, 3]
 */
export const primeFactors = (a: number): number[] => {
  const factors: number[] = [];
  let divisor = 2;

  while (a >= 2) {
    if (a % divisor === 0) {
      factors.push(divisor);
      a = a / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
};
