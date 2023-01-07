import { Node, NodeType } from "../node";
import { OperatorNode } from "./operatorNode";

export class MultiplyNode implements Node, OperatorNode {
  leftChild: Node;
  rightChild: Node;
  type: NodeType = NodeType.operator;
  id: string = "multiply";
  tex = "\\times";
  constructor(leftChild: Node, rightChild: Node) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}
