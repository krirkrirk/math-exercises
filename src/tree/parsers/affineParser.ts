import { Affine } from "#root/math/polynomials/affine";
import { Node } from "../nodes/node";
import { isNumberNode } from "../nodes/numbers/numberNode";
import { isMultiplyNode } from "../nodes/operators/multiplyNode";
import { isVariableNode } from "../nodes/variables/variableNode";
import { parseLatex } from "./latexParser";

export const affineParser = (ans: string, variable: string = "x") => {
  const parsed = parseLatex(ans);
  if (isVariableNode(parsed)) {
    if (parsed.name !== variable) return false;
    return parsed;
  }
  //!won't handle Affines à coefficients non entiers
  if (isMultiplyNode(parsed)) {
    if (
      isVariableNode(parsed.rightChild) &&
      parsed.rightChild.name === variable &&
      isNumberNode(parsed.leftChild)
    ) {
      return new Affine(parsed.leftChild.value, 0, variable);
    }
  }
  //"x" ou a*x ou a*x+b ou x+b
};
