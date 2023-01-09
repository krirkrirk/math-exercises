import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "./operatorNode";

export class SubstractNode extends OperatorNode {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.substract, leftChild, rightChild, false, "-");
  }
  toString(): string {
    return `${this.leftChild}-(${this.rightChild})`;
  }
}
