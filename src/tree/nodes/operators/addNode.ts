import { add } from 'mathjs';
import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

const addNodeToTex = (leftTex: string, rightTex: string) => {
  return `${leftTex}${rightTex[0] === '-' ? '' : '+'}${rightTex}`;
};
export class AddNode extends OperatorNode implements Node {
  constructor(leftChild: Node, rightChild: Node) {
    super(OperatorIds.add, leftChild, rightChild, true, '+');
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
  toMathString(): string {
    return `${this.leftChild.toMathString()} + (${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new AddNode(leftNode, rightNode));
        res.push(new AddNode(rightNode, leftNode));
      });
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(): string {
    const rightTex = this.rightChild.toTex();
    return addNodeToTex(this.leftChild.toTex(), rightTex);
  }
  toMathjs() {
    return add(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
