import { Expression } from "../expression/expression";
import { Operation } from "./operation";

export const add: Operation = {
  tex: "+",
  mathApply: (a: Expression, b: Expression): Expression => {
    return a.add(b);
  },
  texApply: (a: Expression, b: Expression): string => {
    const aTex = a.toTex?.() || a + "";
    const bTex = b.toTex?.() || b + "";
    if (bTex[0] === "-") return `${aTex} + ${bTex}`;
    return `${aTex} + ${bTex}`;
  },
};
