import { divide } from 'mathjs';
import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

const divideNodeToTex = (leftChild: Node, rightChild: Node) => {
  let rightTex = rightChild.toTex();
  let leftTex = leftChild.toTex();

  if (leftChild.type === NodeType.operator) {
    if (
      [OperatorIds.add, OperatorIds.substract, OperatorIds.multiply].includes((leftChild as unknown as OperatorNode).id)
    )
      leftTex = `\\left(${leftTex}\\right)`;
  }
  let needBrackets = rightTex[0] === '-';
  if (rightChild.type === NodeType.operator) {
    const operatorRightChild = rightChild as unknown as OperatorNode;
    needBrackets ||= [OperatorIds.add, OperatorIds.substract, OperatorIds.divide].includes(operatorRightChild.id);
  }
  if (needBrackets) rightTex = `\\left(${rightTex}\\right)`;
  const nextIsLetter = rightTex[0].toLowerCase() !== rightTex[0].toUpperCase();
  return `${leftTex}\\div${nextIsLetter ? ' ' : ''}${rightTex}`;
};

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

  toEquivalentNodes() {
    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new DivideNode(leftNode, rightNode));
      });
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(): string {
    return divideNodeToTex(this.leftChild, this.rightChild);
  }
  toMathjs() {
    return divide(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
