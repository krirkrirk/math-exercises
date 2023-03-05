export const isSquare = (a: number): boolean => {
  return a > 0 && Math.sqrt(a) % 1 === 0;
};
