export const decimalPartLengthOf = (x: number) => {
  function hasFraction(x: number) {
    return Math.abs(Math.round(x) - x) > 1e-10;
  }

  let count = 0;
  // multiply by increasing powers of 10 until the fractional part is ~ 0
  while (hasFraction(x * 10 ** count) && isFinite(10 ** count)) count++;
  return count;
};
