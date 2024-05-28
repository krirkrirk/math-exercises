export type FunctionVariations = {
  start: number | "-infini" | "+infini";
  startSign: "-" | "+";
  end: number | "-infini" | "+infini";
  variations: { changePoint: number; sign: "+" | "-" }[];
};
