import { AlgebraicNode } from "../algebraicNode";
import { Node, NodeType } from "../node";

export enum OperatorIds {
  add,
  substract,
  multiply,
  fraction,
  divide,
  power,
  limit,
  integral,
  binomialCoefficient,
}

export interface OperatorNode extends AlgebraicNode {
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
}
export function isOperatorNode(a: Node): a is OperatorNode {
  return a.type === NodeType.operator;
}

export interface CommutativeOperatorNode extends OperatorNode {
  shuffle: () => void;
  toAllTexs: () => string[];
}
