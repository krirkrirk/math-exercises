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
  toString(): string {
    return `${this.leftChild} + ${this.rightChild}`;
  }
}
