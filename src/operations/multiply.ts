import { Expression } from "../expression/expression";
import { Operation } from "./operation";

export const multiply: Operation = {
  tex: "\\times",
  mathApply: (a: Expression, b: Expression): Expression => {
    return a.multiply(b);
  },
  texApply: (a: Expression, b: Expression): string => {
    const aTex = a.toTex?.() || a + "";
    const bTex = b.toTex?.() || b + "";
    const shouldAddBracketsToA = aTex.includes("-") || aTex.includes("+");
    const shouldAddBracketsToB = bTex.includes("-") || bTex.includes("+");
    if (shouldAddBracketsToB && shouldAddBracketsToA) {
      return `(${aTex}) (${bTex})`;
    } else if (shouldAddBracketsToB) {
      return `${aTex} (${bTex})`;
    } else if (shouldAddBracketsToA) {
      return `(${aTex}) \\times ${bTex}`;
    } else {
      return `${aTex} \\times ${bTex}`;
    }
  },
};
