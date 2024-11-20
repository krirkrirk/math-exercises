import { Point } from "#root/math/geometry/point";
import { getCartesiansProducts } from "#root/utils/arrays/cartesianProducts";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";

export class PointNode implements Node {
  opts?: NodeOptions | undefined;
  point: Point;
  type: NodeType;

  constructor(point: Point, opts?: NodeOptions) {
    this.type = NodeType.point;
    this.opts = opts;
    this.point = point;
  }
  toIdentifiers() {
    return {
      id: NodeIds.point,
      point: this.point.toIdentifiers(),
    };
  }
  toAllTexs() {
    return [this.point.toTexWithCoords(), this.point.toCoords()];
  }
  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).flatMap((node) =>
      node.toAllTexs(),
    );
  }

  toEquivalentNodes(opts?: NodeOptions) {
    const res: PointNode[] = [];
    const equivs = [
      this.point.x.toEquivalentNodes(opts),
      this.point.y.toEquivalentNodes(opts),
    ];
    const cartesians = getCartesiansProducts(equivs);
    cartesians.forEach((product) => {
      res.push(
        new PointNode(new Point(this.point.name, product[0], product[1]), opts),
      );
    });
    return res;
  }

  toMathString() {
    return this.toTex();
  }
  toMathjs() {
    return this.toTex();
  }

  toTex() {
    return this.point.toTexWithCoords();
  }
  simplify() {
    return this;
  }
}
