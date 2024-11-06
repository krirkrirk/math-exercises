//returns false if ans is NaN (even in french form) and returns the frenchified form otherwise
export const numberParser = (ans: string) => {
  const nb = ans.unfrenchify();
  if (isNaN(nb)) return false;
  return nb.frenchify();
};
