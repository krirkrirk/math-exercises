import { Node, NodeType } from "../node";
import { OperatorNode } from "./operatorNode";

export class OppositeNode implements Node, OperatorNode {
  leftChild: Node;
  rightChild: null;
  type: NodeType = NodeType.operator;
  id: string = "opposite";
  tex = "-";
  constructor(leftChild: Node) {
    this.leftChild = leftChild;
    this.rightChild = null;
  }
  toString(): string {
    return `-(${this.leftChild})`;
  }
}
