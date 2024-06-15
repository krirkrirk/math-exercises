import { MathLatex } from "#root/math/utils/functions/mathLatex";

export type FunctionVariations = {
  start: MathLatex;
  startSign: "-" | "+";
  end: MathLatex;
  variations: { changePoint: MathLatex; sign: "-" | "+" }[];
};

export function FunctionVariationsConstructor(
  start: MathLatex,
  startSign: "-" | "+",
  end: MathLatex,
  variations: { changePoint: MathLatex; sign: "-" | "+" }[],
): FunctionVariations {
  return {
    start: start,
    startSign,
    end: end,
    variations,
  };
}
