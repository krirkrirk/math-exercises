import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

export class FractionNode extends OperatorNode implements Node {
  /**
   * @param leftChild num
   * @param rightChild denum
   */
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.fraction, leftChild, rightChild, false, '\\frac');
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()}) / (${this.rightChild.toMathString()})`;
  }
  toTex(): string {
    return `\\frac{${this.leftChild.toTex()}}{${this.rightChild.toTex()}}`;
  }
}
