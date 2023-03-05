export const dividersOf = (nb: number) => {
  let divisors = [];
  for (let i = 1; i <= nb; i++) {
    if (nb % i === 0) divisors.push(i);
  }
  return divisors;
};
