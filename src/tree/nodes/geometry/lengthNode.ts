import { AlgebraicNode } from "../algebraicNode";
import { NodeOptions, NodeType } from "../node";

export class LengthNode implements AlgebraicNode {
  opts?: NodeOptions | undefined;
  segmentName: string;
  type: NodeType;

  constructor(segmentName: string, opts?: NodeOptions) {
    this.type = NodeType.mesure;
    this.opts = opts;
    this.segmentName = segmentName;
  }

  //   toAllTexs() {
  //     return [this.segmentName, this.segmentName.split("").reverse().join()];
  //   }
  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).flatMap((node) => node.toTex());
  }

  toEquivalentNodes(opts?: NodeOptions) {
    return [
      this,
      new LengthNode(this.segmentName.split("").reverse().join("")),
    ];
  }

  toMathString() {
    return this.toTex();
  }
  toMathjs() {
    return this.toTex();
  }

  toTex() {
    return this.segmentName;
  }

  evaluate(vars: Record<string, number>) {
    const value =
      vars[this.segmentName] ??
      vars[this.segmentName.split("").reverse().join("")];
    if (value === undefined)
      throw Error(`Can't evaluate length ${this.segmentName}`);
    return value;
  }
}
