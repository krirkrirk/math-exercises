export type MathLatex = {
  latexValue: string;
  mathValue: number;
};

export function MathLatexConstructor(
  latexValue: string,
  mathValue: number,
): MathLatex {
  return { latexValue, mathValue };
}
