import { AlgebraicNode } from "../algebraicNode";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
export function isLengthNode(a: Node): a is LengthNode {
  return a.type === NodeType.mesure;
}
export class LengthNode implements AlgebraicNode {
  opts?: NodeOptions | undefined;
  segmentName: string;
  type: NodeType;
  isNumeric: boolean;
  constructor(segmentName: string, opts?: NodeOptions) {
    this.type = NodeType.mesure;
    this.opts = opts;
    this.segmentName = segmentName;
    this.isNumeric = false;
  }

  //   toAllTexs() {
  //     return [this.segmentName, this.segmentName.split("").reverse().join()];
  //   }
  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).flatMap((node) => node.toTex());
  }
  toIdentifiers() {
    return {
      id: NodeIds.length,
      name: this.segmentName,
    };
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

  evaluate(vars?: Record<string, number>) {
    const value =
      vars?.[this.segmentName] ??
      vars?.[this.segmentName.split("").reverse().join("")];
    if (value === undefined)
      throw Error(`Can't evaluate length ${this.segmentName}`);
    return value;
  }
  simplify() {
    return this;
  }
  equals(node: AlgebraicNode) {
    return isLengthNode(node) && node.segmentName === this.segmentName;
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return this;
  }
}
