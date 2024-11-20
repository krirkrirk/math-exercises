import { AlgebraicNode, isAlgebraicNode } from "../nodes/algebraicNode";
import { isEqualNode } from "../nodes/equations/equalNode";
import { hasVariableNode } from "../nodes/hasVariableNode";
import { parseLatex } from "./latexParser";

export const equationSolutionParser = (str: string) => {
  try {
    const parsed = parseLatex(str);
    if (isEqualNode(parsed)) {
      const children = [parsed.leftChild, parsed.rightChild];
      const scalar = children.find((e) => !hasVariableNode(e));
      if (!scalar) return false;
      return scalar as AlgebraicNode;
    } else if (isAlgebraicNode(parsed)) {
      return parsed;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
