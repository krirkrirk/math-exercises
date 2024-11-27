// import { equal } from "mathjs";
import { AlgebraicNode } from "../algebraicNode";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";

export const equal = (
  a: AlgebraicNode | number | string,
  b: AlgebraicNode | number | string,
) => {
  const nodeA =
    typeof a === "number" ? a.toTree() : typeof a === "string" ? a.toTree() : a;
  const nodeB =
    typeof b === "number" ? b.toTree() : typeof b === "string" ? b.toTree() : b;
  return new EqualNode(nodeA, nodeB);
};

export const isEqualNode = (node: Node): node is EqualNode =>
  node.type === NodeType.equality;

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

  toIdentifiers() {
    return {
      id: NodeIds.equal,
      leftChild: this.leftChild.toIdentifiers(),
      rightChild: this.rightChild.toIdentifiers(),
    };
  }
  toEquivalentNodes(opts?: NodeOptions) {
    const options = opts ?? this.opts;

    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes(options);

    if (options?.allowRawRightChildAsSolution) {
      res.push(...rightNodes);
    }
    const leftNodes = this.leftChild.toEquivalentNodes(options);
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new EqualNode(leftNode, rightNode, options));
        res.push(new EqualNode(rightNode, leftNode, options));
      });
    });
    return res;
  }

  toAllValidTexs(opts?: NodeOptions): string[] {
    const options = opts ?? this.opts;

    return this.toEquivalentNodes(options).map((node) => node.toTex());
  }

  toMathString(): string {
    return `${this.leftChild.toMathString()} = ${this.rightChild.toMathString()}`;
  }
  toTex(): string {
    return `${this.leftChild.toTex()}=${this.rightChild.toTex()}`;
  }

  simplify() {
    return this;
  }

  // toMathjs() {
  //   return equal(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }
  // times(x: AlgebraicNode): EqualNode{

  // }
}
