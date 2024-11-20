import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "../operators/operatorNode";
import { SetNode } from "./setNode";

export class BelongsNode implements Node {
  type: NodeType;
  opts?: NodeOptions | undefined;
  leftChild: Node;
  rightChild: SetNode;
  constructor(leftChild: Node, rightChild: SetNode, opts?: NodeOptions) {
    this.type = NodeType.belongs;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.opts = opts;
  }
  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).map((node) => node.toTex());
  }
  toEquivalentNodes(opts?: NodeOptions): Node[] {
    const options = opts ?? this.opts;
    const rightEquivs = this.rightChild.toEquivalentNodes(options);
    if (options?.allowRawRightChildAsSolution)
      return rightEquivs.flatMap((equiv) => [
        new BelongsNode(this.leftChild, equiv, options),
        equiv,
      ]);
    else
      return rightEquivs.map(
        (equiv) => new BelongsNode(this.leftChild, equiv, options),
      );
  }

  toMathString() {
    return this.toTex();
  }
  toMathjs() {
    return this.toTex();
  }
  toTex() {
    return `${this.leftChild.toTex()}\\in${this.rightChild.toTex()}`;
  }
  toIdentifiers() {
    return {
      id: NodeIds.belongs,
      leftChild: this.leftChild.toIdentifiers(),
      rightChild: this.rightChild.toIdentifiers(),
    };
  }
  simplify() {
    return this;
  }
}
