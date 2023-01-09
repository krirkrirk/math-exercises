import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "./operatorNode";

export class AddNode extends OperatorNode {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.add, leftChild, rightChild, true, "+");
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
  toString(): string {
    return `${this.leftChild} + ${this.rightChild}`;
  }
}
