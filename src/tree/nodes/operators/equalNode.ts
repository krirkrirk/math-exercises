import { equal } from 'mathjs';
import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from './operatorNode';

type EqualNodeOptions = {
  isRightChildOnlyValid?: boolean;
};
export class EqualNode extends OperatorNode implements Node {
  opts: EqualNodeOptions | undefined;
  constructor(leftChild: Node, rightChild: Node, opts?: EqualNodeOptions) {
    super(OperatorIds.equal, leftChild, rightChild, true, '=');
    this.opts = opts;
  }

  toEquivalentNodes() {
    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();

    if (this.opts?.isRightChildOnlyValid) {
      res.push(...rightNodes);
    }
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new EqualNode(leftNode, rightNode));
        res.push(new EqualNode(rightNode, leftNode));
      });
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toMathString(): string {
    return `${this.leftChild.toMathString()} = ${this.rightChild.toMathString()}`;
  }
  toTex(): string {
    return `${this.leftChild.toTex()}=${this.rightChild.toTex()}`;
  }

  toMathjs() {
    return equal(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
