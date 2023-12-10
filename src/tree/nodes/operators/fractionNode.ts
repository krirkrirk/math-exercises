import { fraction } from 'mathjs';
import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';
import { NumberNode } from '../numbers/numberNode';
import { FunctionNode, FunctionsIds } from '../functions/functionNode';
import { NumberType } from '#root/math/numbers/nombre';
import { round } from '#root/math/utils/round';

export type FractionNodeOptions = {
  allowDecimalSyntax?: boolean;
  forceMinusBefore?: boolean;
};
export class FractionNode extends OperatorNode implements Node {
  opts?: FractionNodeOptions;
  /**
   * @param leftChild num
   * @param rightChild denum
   */
  constructor(leftChild: Node, rightChild: Node, opts?: FractionNodeOptions) {
    super(OperatorIds.fraction, leftChild, rightChild, false, '\\frac');
    this.opts = opts;
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
        if (this.opts?.allowDecimalSyntax && leftNode.type === NodeType.number && rightNode.type === NodeType.number) {
          const [num, denum] = [(leftNode as NumberNode).value, (rightNode as NumberNode).value];
          const decimal = round(num / denum, 12);
          //on ne push pas les non décimaux (limite arbitraire : partie décimale de 12 => non décimal)
          if ((decimal + '').split('.')[1].length > 11) return;
          res.push(new NumberNode(decimal));
        }
      });
    });
    return res;
    //! cas x/2 : doit on créer 1*x/2 ainsi que 0.5*x ??
    //! si le num est un multiplynode, ex x*y/z , est ce qu'on créé x*(y/z), y*(x/z) ??
    //! est ce qu'on gère le placement du moins n'importe où
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
