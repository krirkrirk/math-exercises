import { Node, NodeType } from "../node";

export class PowerNode implements Node {
  tex = "^";
  type = NodeType.operator;
  id = "power";
  leftChild: Node;
  rightChild: Node;
  constructor(leftChild: Node, rightChild: Node) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }

  toString(): string {
    return `(${this.leftChild})^{${this.rightChild}}`;
  }
}
