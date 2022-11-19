export const randint = (a: number, b?: number) => {
  if (b === undefined) return Math.floor(Math.random() * a);
  return a + Math.floor(Math.random() * (b - a));
};
