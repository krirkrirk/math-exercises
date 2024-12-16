import { AlgebraicNode } from "../nodes/algebraicNode";
import { isNumberNode } from "../nodes/numbers/numberNode";
import { isFractionNode } from "../nodes/operators/fractionNode";
import { isMultiplyNode } from "../nodes/operators/multiplyNode";
import { isPowerNode } from "../nodes/operators/powerNode";
import { isVariableNode } from "../nodes/variables/variableNode";
import { parseAlgebraic } from "./latexParser";

type Opts = {
  variable: string;
  maxDegree?: number;
  minDegree?: number;
};
export const monomParser = (
  str: string,
  { variable, maxDegree, minDegree }: Opts = {
    variable: "x",
    maxDegree: undefined,
    minDegree: 0,
  },
) => {
  try {
    const parsed = parseAlgebraic(str);
    return isMonomNode(parsed, { variable, maxDegree, minDegree })
      ? parsed
      : false;
    if (isFractionNode(parsed)) {
      //!unimplemented
      return false;
    } else return false;
  } catch (err) {
    return false;
  }
};

export const isMonomNode = (
  node: AlgebraicNode,
  { variable, maxDegree, minDegree }: Opts = {
    variable: "x",
    maxDegree: undefined,
    minDegree: 0,
  },
) => {
  variable = variable ?? "x";
  maxDegree = maxDegree ?? undefined;
  minDegree = minDegree ?? 0;

  if (node.isNumeric && minDegree === 0) return true;
  if (isVariableNode(node) && node.name === variable && minDegree < 2)
    return true;

  if (isMultiplyNode(node)) {
    const numericChild = node.leftChild.isNumeric
      ? "left"
      : node.rightChild.isNumeric
      ? "right"
      : undefined;
    if (!numericChild) return false;
    const varChild = numericChild === "left" ? node.rightChild : node.leftChild;
    if (isVariableNode(varChild) && varChild.name === "x" && minDegree < 2)
      return true;

    if (
      isPowerNode(varChild) &&
      isVariableNode(varChild.leftChild) &&
      varChild.leftChild.name === "x" &&
      varChild.rightChild.isNumeric
    ) {
      const powerEv = varChild.rightChild.evaluate();
      if (maxDegree && powerEv > maxDegree) return false;
      if (minDegree && powerEv < minDegree) return false;
      return true;
    }
  }
  return false;
};
