import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { randint } from "../utils/random/randint";
import { Point } from "./point";

export class Line {
  pointA: Point;
  pointB: Point;
  isVertical: boolean;
  a: AlgebraicNode | undefined;
  b: AlgebraicNode | undefined;
  constructor(pointA: Point, pointB: Point) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.isVertical = pointA.x.equals(pointB.x);
    if (this.isVertical) {
      this.a = undefined;
      this.b = undefined;
    } else {
      this.a = new FractionNode(
        new SubstractNode(this.pointB.y, this.pointA.y),
        new SubstractNode(this.pointB.x, this.pointA.x),
      ).simplify();
      this.b = new SubstractNode(
        this.pointA.y,
        new MultiplyNode(this.a, this.pointA.x),
      ).simplify();
    }
  }
  getParallele(point: Point) {
    if (this.isVertical) {
      console.log(this.pointA.toTexWithCoords(), this.pointB.toTexWithCoords());
      throw Error("Parallel vertical lines not implemented");
    }
    const x = new AddNode(point.x, new NumberNode(1)).simplify();
    const y = new AddNode(point.y, this.a!).simplify();
    const secondPoint = new Point("D", x, y);
    return new Line(point, secondPoint);
  }
  includes(point: Point) {
    if (this.isVertical) {
      return point.x.equals(this.pointA.x);
    }
    return (
      new SubstractNode(
        point.y,
        new AddNode(new MultiplyNode(this.a!, point.x), this.b!),
      ).evaluate({}) === 0
    );
  }

  //! caution: simplify ne gère pas bien ici
  getRandomPoint(name?: string) {
    if (this.isVertical) {
      return new Point(
        name ?? "A",
        this.pointA.x,
        new NumberNode(randint(-10, 10)),
      );
    }
    const x = new NumberNode(randint(-10, 10));
    const y = new AddNode(new MultiplyNode(this.a!, x), this.b!).simplify();
    console.log(y.toTex(), this.a!.toTex(), x.toTex(), this.b?.toTex());
    return new Point(name ?? "A", x, y);
  }
}
