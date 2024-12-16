import { Affine } from "#root/math/polynomials/affine";
import { Node } from "../nodes/node";
import { isNumberNode } from "../nodes/numbers/numberNode";
import { isAddNode } from "../nodes/operators/addNode";
import { isMultiplyNode } from "../nodes/operators/multiplyNode";
import { isSubstractNode } from "../nodes/operators/substractNode";
import { isVariableNode } from "../nodes/variables/variableNode";
import { parseAlgebraic } from "./latexParser";
import { isMonomNode, monomParser } from "./monomParser";

export const affineParser = (ans: string, variable: string = "x") => {
  try {
    const monom = monomParser(ans, { variable, maxDegree: 1 });
    if (monom) return monom;

    const parsed = parseAlgebraic(ans);
    if (isAddNode(parsed) || isSubstractNode(parsed)) {
      const numericChild = parsed.leftChild.isNumeric
        ? "left"
        : parsed.rightChild.isNumeric
        ? "right"
        : undefined;
      if (!numericChild) return false;
      const varChild =
        numericChild === "left" ? parsed.rightChild : parsed.leftChild;
      return isMonomNode(varChild, { variable, maxDegree: 1 }) ? parsed : false;
    }
    return false;
  } catch (err) {
    return false;
  }
};
