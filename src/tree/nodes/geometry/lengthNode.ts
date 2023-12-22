import { Point } from "#root/math/geometry/point";
import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { Node, NodeOptions, NodeType } from "../node";

export class LengthNode implements Node {
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
}
