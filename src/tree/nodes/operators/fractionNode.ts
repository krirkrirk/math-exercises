import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "./operatorNode";

export class FractionNode extends OperatorNode {
  /**
   * @param leftChild num
   * @param rightChild denum
   */
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.fraction, leftChild, rightChild, false, "\\frac");
  }

  toString(): string {
    return `\\frac{${this.leftChild}}{${this.rightChild}}`;
  }
}
