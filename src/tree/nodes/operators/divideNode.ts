import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "./operatorNode";

export class DivideNode extends OperatorNode {
  /**
   * @param leftChild num
   * @param rightChild denum
   */
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.divide, leftChild, rightChild, false, "\\div");
  }

  toString(): string {
    return `(${this.leftChild}) \\div (${this.rightChild})`;
  }
}
