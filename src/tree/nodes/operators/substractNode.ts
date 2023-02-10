import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

export class SubstractNode extends OperatorNode implements Node {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.substract, leftChild, rightChild, false, '-');
  }
  toMathString(): string {
    return `${this.leftChild.toMathString()}-(${this.rightChild.toMathString()})`;
  }
  toTex(): string {
    let rightTex = this.rightChild.toTex();
    let leftTex = this.leftChild.toTex();

    const needBrackets =
      (this.rightChild.type === NodeType.operator &&
        [OperatorIds.add, OperatorIds.substract].includes((this.rightChild as unknown as OperatorNode).id)) ||
      rightTex[0] === '-';

    if (needBrackets) rightTex = `(${rightTex})`;

    return `${leftTex} - ${rightTex}`;
  }
}
