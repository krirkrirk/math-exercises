import { isFunctionNode } from "./functions/functionNode";
import { isOperatorNode } from "./operators/operatorNode";
import { isVariableNode } from "./variables/variableNode";

export enum NodeType {
  number,
  constant,
  variable,
  operator,
  function,
  set,
  inequation,
  point,
  mesure,
  equality,
  belongs,
  vector,
}
export type NodeOptions = {
  forceTimesSign?: boolean;
  forbidPowerToProduct?: boolean; //par exemple, pour x^2, si cette prop est true, toEquivalentNodes va sortir l'arbre Multiply(x,x) en plus de l'arbre Power(x,2)
  allowRawRightChildAsSolution?: boolean;
  allowFractionToDecimal?: boolean;
  allowMinusAnywhereInFraction?: boolean;
  useExpNotation?: boolean;
  allowLnOfOne?: boolean;
  allowPowerOne?: boolean;
  allowSimplifySqrt?: boolean;
};

export type ToTexOptions = {
  displayStyle?: boolean;
  forceDotSign?: boolean;
  //number est le nombre de décimals significatifs
  scientific?: number;
  hideUnit?: boolean;
  notScientific?: boolean;
};
export interface Node {
  type: NodeType;
  opts?: NodeOptions;
  toMathString: () => string;
  toEquivalentNodes: (opts?: NodeOptions) => Node[];
  toAllValidTexs: (opts?: NodeOptions) => string[];
  toTex: (opts?: ToTexOptions) => string;
  // toMathjs: () => any;
  // simplify: () => Node;
}

export const hasVariableNode = (n: Node): boolean => {
  if (isVariableNode(n)) return true;
  if (isOperatorNode(n))
    return hasVariableNode(n.leftChild) || hasVariableNode(n.rightChild);
  if (isFunctionNode(n)) return hasVariableNode(n.child);
  return false;
};
