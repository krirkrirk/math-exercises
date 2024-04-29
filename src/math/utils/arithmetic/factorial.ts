export const factorial = (nb: number): number => {
  let result = 1;
  for (let i = 2; i <= nb; i++) result = result * i;
  return result;
};
