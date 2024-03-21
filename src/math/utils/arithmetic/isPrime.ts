export const isPrime = (n: number) => {
  if (n === 0 || n === 1) return false;
  const sqrt = Math.floor(Math.sqrt(n));
  for (let i = 2; i <= sqrt; i++) {
    if (n % i === 0) return false;
  }
  return true;
};
