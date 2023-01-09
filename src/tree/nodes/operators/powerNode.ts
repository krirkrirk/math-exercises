import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "./operatorNode";

export class PowerNode extends OperatorNode {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.power, leftChild, rightChild, false, "^");
  }

  toString(): string {
    return `(${this.leftChild})^{${this.rightChild}}`;
  }
}
