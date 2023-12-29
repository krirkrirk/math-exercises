import { equal } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "../operators/operatorNode";

export class EqualNode implements Node {
  leftChild: Node;
  rightChild: Node;
  opts?: NodeOptions;
  type: NodeType;
  constructor(leftChild: Node, rightChild: Node, opts?: NodeOptions) {
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.equality;
    this.opts = opts;
  }

  toEquivalentNodes() {
    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();

    if (this.opts?.allowRawRightChildAsSolution) {
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
