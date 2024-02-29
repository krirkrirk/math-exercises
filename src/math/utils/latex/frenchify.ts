export const frenchify = (s: string | number) => {
  if (typeof s === "number") return s.toString().replace(".", ",");
  return s.replace(".", ",");
};
