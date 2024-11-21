export const valueParser = (ans: string) => {
  const nb = ans.unfrenchify();
  if (isNaN(nb)) return false;
  return nb;
};
