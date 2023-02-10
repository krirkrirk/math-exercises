import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

export class EqualNode extends OperatorNode implements Node {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.equal, leftChild, rightChild, true, '=');
  }
  toMathString(): string {
    return `${this.leftChild.toMathString()} = ${this.rightChild.toMathString()}`;
  }
  toTex(): string {
    return `${this.leftChild.toTex()} = ${this.rightChild.toTex()}`;
  }
}
