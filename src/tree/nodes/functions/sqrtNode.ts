import { Node, NodeType } from "../node";

export class SqrtNode implements Node {
  leftChild: Node;
  rightChild: null;
  type: NodeType = NodeType.function;
  id: string = "sqrt";
  tex = "\\sqrt";
  constructor(leftChild: Node) {
    this.leftChild = leftChild;
    this.rightChild = null;
  }
  toString(): string {
    return `sqrt(${this.leftChild})`;
  }
}
