export const approxEqual = (x: number, y: number, margin: number = 0.3) => {
  return Math.abs(x - y) < margin;
};
