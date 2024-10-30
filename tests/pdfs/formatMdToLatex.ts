import { mdCodeToLatex } from "./mdCodeToLatex";
import { mdTableToLatexTabular } from "./mdTableToLatexTabular";

export const formatMarkdownToLatex = (text: string) => {
  const format = text
    .replaceAll("\\left\\{", "\\left\\lbrace")
    .replaceAll("\\\\", "\\tabularnewline")
    .replaceAll("€", "\\euro");
  return mdCodeToLatex(mdTableToLatexTabular(format));
};
