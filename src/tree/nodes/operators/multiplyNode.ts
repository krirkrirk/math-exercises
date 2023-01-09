import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "./operatorNode";

export class MultiplyNode extends OperatorNode {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.multiply, leftChild, rightChild, true, "\\times");
  }

  toString(): string {
    return `(${this.leftChild})*(${this.rightChild})`;
  }
}
