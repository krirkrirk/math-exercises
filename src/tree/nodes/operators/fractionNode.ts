import { fraction } from 'mathjs';
import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';
import { NumberNode } from '../numbers/numberNode';
import { FunctionNode, FunctionsIds } from '../functions/functionNode';

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

  toEquivalentNodes() {
    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new FractionNode(leftNode, rightNode));
      });
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(): string {
    if (
      (this.leftChild.type === NodeType.function &&
        (this.leftChild as unknown as FunctionNode).id === FunctionsIds.opposite) ||
      (this.leftChild.type === NodeType.number && (this.leftChild as unknown as NumberNode).value < 0)
    ) {
      return `-\\frac{${this.leftChild.toTex().slice(1)}}{${this.rightChild.toTex()}}`;
    }

    return `\\frac{${this.leftChild.toTex()}}{${this.rightChild.toTex()}}`;
  }

  toMathjs() {
    return fraction(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
