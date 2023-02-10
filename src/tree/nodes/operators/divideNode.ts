import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

export class DivideNode extends OperatorNode implements Node {
  /**
   * @param leftChild num
   * @param rightChild denum
   */
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.divide, leftChild, rightChild, false, '\\div');
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()}) / (${this.rightChild.toMathString()})`;
  }

  toTex(): string {
    let rightTex = this.rightChild.toTex();
    let leftTex = this.leftChild.toTex();

    if (this.leftChild.type === NodeType.operator) {
      if (
        [OperatorIds.add, OperatorIds.substract, OperatorIds.multiply].includes(
          (this.leftChild as unknown as OperatorNode).id,
        )
      )
        leftTex = `(${leftTex})`;
    }
    let needBrackets = rightTex[0] === '-';
    if (this.rightChild.type === NodeType.operator) {
      const operatorRightChild = this.rightChild as unknown as OperatorNode;
      needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(operatorRightChild.id);
    }
    if (needBrackets) rightTex = `(${rightTex})`;

    return `${leftTex} \\div ${rightTex}`;
  }
}
