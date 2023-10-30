import { multiply } from 'mathjs';
import { FunctionNode, FunctionsIds } from '../functions/functionNode';
import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

export class MultiplyNode extends OperatorNode implements Node {
  forceTimesSign?: boolean;
  constructor(leftChild: Node, rightChild: Node, forceTimesSign?: boolean) {
    let [left, right] = [leftChild, rightChild];
    const shouldSwitch =
      (rightChild.type === NodeType.function && (rightChild as unknown as FunctionNode).id === FunctionsIds.opposite) ||
      (leftChild.type === NodeType.constant && rightChild.type === NodeType.number);
    if (shouldSwitch) {
      [left, right] = [rightChild, leftChild];
    }

    super(OperatorIds.multiply, left, right, true, '\\times');
    this.forceTimesSign = forceTimesSign;
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()})*(${this.rightChild.toMathString()})`;
  }

  toTex(): string {
    let leftTex = this.leftChild.toTex();
    let rightTex = this.rightChild.toTex();

    if (this.rightChild.type === NodeType.variable) {
      if (leftTex === '1') {
        return rightTex;
      }
    }

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
    let showTimesSign = this.forceTimesSign || !isNaN(+rightTex[0]) || this.rightChild.type === NodeType.number;
    if (this.rightChild.type === NodeType.operator) {
      const operatorRightChild = this.rightChild as unknown as OperatorNode;
      showTimesSign ||= [OperatorIds.fraction].includes(operatorRightChild.id);
    }
    const nextIsLetter = rightTex[0].toLowerCase() !== rightTex[0].toUpperCase();
    return `${leftTex}${showTimesSign ? `\\times${nextIsLetter ? ' ' : ''}` : ''}${rightTex}`;
  }

  toMathjs() {
    return multiply(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
