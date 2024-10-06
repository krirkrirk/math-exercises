export const colorize = (str: string, color: string | undefined) => {
  if (!color) return str;
  return `\\textcolor{${color}}{${str}}`;
};
