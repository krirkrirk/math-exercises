import { AlgebraicNode } from "../algebraicNode";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";

export class VectorNode implements Node {
  opts?: NodeOptions | undefined;
  name: string;
  type: NodeType;

  constructor(name: string, opts?: NodeOptions) {
    this.type = NodeType.vector;
    this.opts = opts;
    this.name = name;
  }

  //   toAllTexs() {
  //     return [this.segmentName, this.segmentName.split("").reverse().join()];
  //   }
  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).flatMap((node) => node.toTex());
  }
  toIdentifiers() {
    return {
      id: NodeIds.vector,
      name: this.name,
    };
  }
  toEquivalentNodes(opts?: NodeOptions) {
    return [this];
  }

  toMathString() {
    return this.toTex();
  }
  toMathjs() {
    return this.toTex();
  }

  toTex() {
    return `\\overrightarrow{${this.name}}`;
  }
  simplify() {
    return this;
  }
}
