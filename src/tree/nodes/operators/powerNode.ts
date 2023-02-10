import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

export class PowerNode extends OperatorNode implements Node {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.power, leftChild, rightChild, false, '^');
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()})^(${this.rightChild.toMathString()})`;
  }

  toTex(): string {
    let rightTex = this.rightChild.toTex();
    let leftTex = this.leftChild.toTex();
    let needBrackets = leftTex[0] === '-';
    if (this.leftChild.type === NodeType.operator) {
      const childOperator = this.leftChild as unknown as OperatorNode;
      needBrackets ||= [
        OperatorIds.add,
        OperatorIds.substract,
        OperatorIds.multiply,
        OperatorIds.divide,
        OperatorIds.fraction,
        OperatorIds.power,
      ].includes(childOperator.id);
    }
    if (needBrackets) leftTex = `(${leftTex})`;
    return `${leftTex}^{${rightTex}}`;
  }
}
