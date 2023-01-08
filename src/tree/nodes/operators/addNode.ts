import { Node, NodeType } from "../node";
import { OperatorNode } from "./operatorNode";

export class AddNode implements Node, OperatorNode {
  leftChild: Node;
  rightChild: Node;
  type: NodeType = NodeType.operator;
  id: string = "add";
  tex = "+";
  constructor(leftChild: Node, rightChild: Node) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
  shuffle() {
    if (Math.random() < 0.5) return;
    const temp = this.leftChild;
    this.leftChild = this.rightChild;
    this.rightChild = temp;
  }
  toString(): string {
    return `${this.leftChild} + ${this.rightChild}`;
  }
}
