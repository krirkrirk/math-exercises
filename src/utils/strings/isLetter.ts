export const isLetter = (str: string) => {
  return str.length === 1 && str.match(/[a-z]/i);
};
