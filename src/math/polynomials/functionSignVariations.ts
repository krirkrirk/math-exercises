import { arrayEqual } from "#root/utils/arrayEqual";
import { MathLatex } from "../mathLatex";

export type FunctionSignVariations = {
  start: MathLatex;
  startSign: "+" | "-";
  end: MathLatex;
  variations: Variation[];
};

export type Variation = {
  changePoint: MathLatex;
  sign: "+" | "-";
};

export function FunctionSignVariations(
  start: MathLatex,
  startSign: "+" | "-",
  end: MathLatex,
  variations: Variation[],
): FunctionSignVariations {
  return {
    start,
    startSign,
    end,
    variations,
  };
}

export function VariationConstructor(
  changePoint: MathLatex,
  sign: "+" | "-",
): Variation {
  return { changePoint, sign };
}

export function functionVariationsEquals(
  f1: FunctionSignVariations,
  f2: FunctionSignVariations,
): boolean {
  if (f1.start.latexValue !== f2.start.latexValue) return false;
  if (f1.startSign !== f2.startSign) return false;
  if (f1.end.latexValue !== f2.end.latexValue) return false;
  return arrayEqual(
    f1.variations,
    f2.variations,
    (value1, value2) =>
      value1.changePoint.latexValue === value2.changePoint.latexValue &&
      value1.sign === value2.sign,
  );
}
