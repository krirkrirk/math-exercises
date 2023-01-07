import { Node, NodeType } from "../node";
import { OperatorNode } from "./operatorNode";

export class DivideNode implements Node, OperatorNode {
  leftChild: Node;
  rightChild: Node;
  type: NodeType = NodeType.operator;
  id: string = "divide";
  tex = "\\frac";

  /**
   * @param leftChild num
   * @param rightChild denum
   */
  constructor(leftChild: Node, rightChild: Node) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }

  toString(): string {
    return `\\frac{${this.leftChild}}{${this.rightChild}}`;
  }
}
