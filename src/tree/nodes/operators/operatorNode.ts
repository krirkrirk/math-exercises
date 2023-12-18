import { coinFlip } from "../../../utils/coinFlip";
import { Node, NodeType } from "../node";

export enum OperatorIds {
  add,
  substract,
  multiply,
  fraction,
  divide,
  power,
  equal,
}

export interface OperatorNode extends Node {
  id: OperatorIds;
  leftChild: Node;
  rightChild: Node;
}

export interface CommutativeOperatorNode extends OperatorNode {
  shuffle: () => void;
  toAllTexs: () => string[];
}
