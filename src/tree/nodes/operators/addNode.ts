import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

export class AddNode extends OperatorNode implements Node {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.add, leftChild, rightChild, true, '+');
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
  toMathString(): string {
    return `${this.leftChild.toMathString()} + (${this.rightChild.toMathString()})`;
  }

  toTex(): string {
    const rightTex = this.rightChild.toTex();
    return `${this.leftChild.toTex()} ${rightTex[0] === '-' ? '' : '+ '}${rightTex}`;
  }
}
