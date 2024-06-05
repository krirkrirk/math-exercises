import { MathLatex } from "../MathLatex";

export type FunctionVariations = {
  start: MathLatex;
  startSign: "+" | "-";
  end: MathLatex;
  variations: Variation[];
};

export type Variation = {
  changePoint: MathLatex;
  sign: "+" | "-";
};
