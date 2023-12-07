import { multiply } from 'mathjs';
import { FunctionNode, FunctionsIds } from '../functions/functionNode';
import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

type MultiplyNodeOptions = {
  forceTimesSign?: boolean;
};
export class MultiplyNode extends OperatorNode implements Node {
  opts?: MultiplyNodeOptions | undefined;
  constructor(leftChild: Node, rightChild: Node, opts?: MultiplyNodeOptions) {
    let [left, right] = [leftChild, rightChild];
    const shouldSwitch =
      (rightChild.type === NodeType.function && (rightChild as unknown as FunctionNode).id === FunctionsIds.opposite) ||
      (leftChild.type === NodeType.constant && rightChild.type === NodeType.number);
    if (shouldSwitch) {
      [left, right] = [rightChild, leftChild];
    }

    super(OperatorIds.multiply, left, right, true, '\\times');
    this.opts = opts;
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
        leftTex = `\\left(${leftTex}\\right)`;
    }

    let needBrackets = rightTex[0] === '-';
    if (this.rightChild.type === NodeType.operator) {
      const operatorRightChild = this.rightChild as unknown as OperatorNode;
      needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(operatorRightChild.id);
    }
    if (needBrackets) rightTex = `\\left(${rightTex}\\right)`;

    let showTimesSign = this.opts?.forceTimesSign || !isNaN(+rightTex[0]) || this.rightChild.type === NodeType.number;
    if (this.rightChild.type === NodeType.operator) {
      const operatorRightChild = this.rightChild as unknown as OperatorNode;
      showTimesSign ||= [OperatorIds.fraction].includes(operatorRightChild.id);
    }
    const nextIsLetter = rightTex[0].toLowerCase() !== rightTex[0].toUpperCase();
    return `${leftTex}${showTimesSign ? `\\times${nextIsLetter ? ' ' : ''}` : ''}${rightTex}`;
  }

  toEquivalentNodes() {
    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();

    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new MultiplyNode(leftNode, rightNode));
        //! pas opti, ca va générer plusieurs nodes avec le même tex
        //! comment gérer ce cas ?
        res.push(new MultiplyNode(leftNode, rightNode, { forceTimesSign: true }));
        res.push(new MultiplyNode(rightNode, leftNode));
        res.push(new MultiplyNode(rightNode, leftNode, { forceTimesSign: true }));
      });
    });
    return res;
  }
  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toMathjs() {
    return multiply(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
