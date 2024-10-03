//to use when the answer is a pure number (int / float etc)
export const numberParser = (ans: string) => {
  const nb = ans.unfrenchify();
  if (isNaN(nb)) return false;
  return nb.frenchify();
};
