import { Expression } from "../expression/expression";
import { Operation } from "./operation";

export const substract: Operation = {
  tex: "-",
  mathApply: (a: Expression, b: Expression): Expression => {
    return a.add(b.opposite());
  },
  texApply: (a: Expression, b: Expression): string => {
    const aTex = a.toTex?.() || a + "";
    const bTex = b.toTex?.() || b + "";
    const shouldAddBrackets = bTex[0] !== "(" && (bTex.includes("-") || bTex.includes("-"));
    if (shouldAddBrackets) {
      return `${aTex} - ${bTex}`;
    } else {
      return `${aTex} - ${bTex}`;
    }
  },
};
