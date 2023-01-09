import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "./operatorNode";

export class EqualNode extends OperatorNode {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.equal, leftChild, rightChild, true, "=");
  }
  toString(): string {
    return `${this.leftChild} = ${this.rightChild}`;
  }
}
