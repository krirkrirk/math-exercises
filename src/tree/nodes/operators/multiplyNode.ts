import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

export class MultiplyNode extends OperatorNode implements Node {
  constructor(leftChild: Node, rightChild: Node) {
    let [left, right] = [leftChild, rightChild];
    const shouldSwitch = leftChild.type === NodeType.constant && rightChild.type === NodeType.number;
    if (shouldSwitch) {
      console.log('switch');
      [left, right] = [rightChild, leftChild];
    }
    console.log('left', left, 'right', right);

    super(OperatorIds.multiply, left, right, true, '\\times');
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()})*(${this.rightChild.toMathString()})`;
  }

  toTex(): string {
    let leftTex = this.leftChild.toTex();
    let rightTex = this.rightChild.toTex();

    if (this.leftChild.type === NodeType.operator) {
      if (
        [OperatorIds.add, OperatorIds.substract, OperatorIds.divide].includes(
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

    //  permet de gérer le cas 3*2^x par ex
    let showTimesSign = !isNaN(+rightTex[0]) || this.rightChild.type === NodeType.number;
    if (this.rightChild.type === NodeType.operator) {
      const operatorRightChild = this.rightChild as unknown as OperatorNode;
      showTimesSign ||= [OperatorIds.fraction].includes(operatorRightChild.id);
    }

    return `${leftTex}${showTimesSign ? '\\times ' : ''}${rightTex}`;
  }
}
