import { pow } from 'mathjs';
import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

type PowerNodeOptions = {
  allowProductSyntax?: boolean; //par exemple, pour x^2, si cette prop est true, toEquivalentNodes va sortir l'arbre Multiply(x,x) en plus de l'arbre Power(x,2)
};
export class PowerNode extends OperatorNode implements Node {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.power, leftChild, rightChild, false, '^');
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()})^(${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes() {
    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new PowerNode(leftNode, rightNode));
        //! ajouter les multiply nodes
      });
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
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
    if (needBrackets) leftTex = `\\left(${leftTex}\\right)`;
    const needBrace = rightTex.length > 1;
    if (needBrace) return `${leftTex}^{${rightTex}}`;
    else return `${leftTex}^${rightTex}`;
  }

  toMathjs() {
    return pow(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
