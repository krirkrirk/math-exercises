import { opposite } from "../nodes/functions/oppositeNode";
import { FractionNode, frac } from "../nodes/operators/fractionNode";
import { numberParser } from "./numberParser";

export const rationalParser = (ans: string) => {
  const nb = numberParser(ans);
  if (nb !== false) {
    return nb.unfrenchify().toTree();
  }
  if (!ans.includes("\\frac")) return false;

  if (ans.startsWith("\\frac")) {
    const fracs = ans.replaceAll("}", "").split("{").slice(1);
    if (fracs.length !== 2) return false;
    const parsedFracs = fracs.map((e) => numberParser(e));
    if (parsedFracs.some((e) => e === false)) return false;
    const nodeFracs = fracs.map((e) => e.unfrenchify().toTree());
    return frac(nodeFracs[0], nodeFracs[1]);
  }
  if (ans.startsWith("-")) {
    const fracString = ans.slice(1);
    const fracs = fracString.replaceAll("}", "").split("{").slice(1);
    if (fracs.length !== 2) return false;
    const parsedFracs = fracs.map((e) => numberParser(e));
    if (parsedFracs.some((e) => e === false)) return false;
    const nodeFracs = fracs.map((e) => e.unfrenchify().toTree());
    return opposite(frac(nodeFracs[0], nodeFracs[1]));
  }
};
