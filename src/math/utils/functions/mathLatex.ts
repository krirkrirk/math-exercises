export type MathLatex = {
  latexValue: string;
  mathValue: number;
};

export const MathLatexConstructor = (
  latexValue: string,
  mathValue: number,
): MathLatex => {
  return { latexValue, mathValue };
};
