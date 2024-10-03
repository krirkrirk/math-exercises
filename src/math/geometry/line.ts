import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { randint } from "../utils/random/randint";
import { Point } from "./point";
import { Vector } from "./vector";

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
      throw Error("Parallel vertical lines not implemented");
    }
    const x = new AddNode(point.x, new NumberNode(1)).simplify();
    const y = new AddNode(point.y, this.a!).simplify();
    const secondPoint = new Point("D", x, y);
    return new Line(point, secondPoint);
  }
  includes(point: Point, allowApprox: boolean = false) {
    if (this.isVertical) {
      if (allowApprox) {
      } else return point.x.equals(this.pointA.x);
    }
    const evaluation = new SubstractNode(
      point.y,
      new AddNode(new MultiplyNode(this.a!, point.x), this.b!),
    ).evaluate({});
    console.log("eval", evaluation);
    if (allowApprox) {
      return Math.abs(evaluation) < 0.0000001;
    } else return evaluation === 0;
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
    return new Point(name ?? "A", x, y);
  }

  getEquation = (u: Vector, a: Point): EqualNode => {
    const x = new VariableNode("x");
    const y = new VariableNode("y");

    const uYDivuX = new FractionNode(u.y, u.x).simplify();
    const natural = u.getYAsNumber() % u.getXAsNumber() === 0;
    const aYuX = new MultiplyNode(a.y, u.x).simplify();
    const aXuY = new MultiplyNode(a.x, u.y).simplify();
    const rightSide = new AddNode(
      natural
        ? new MultiplyNode(uYDivuX, x).simplify()
        : new MultiplyNode(uYDivuX, x),
      new FractionNode(
        new SubstractNode(aYuX, aXuY).simplify(),
        u.x,
      ).simplify(),
    );
    const equation = new EqualNode(y, rightSide);
    return equation;
  };

  getCartesianEquation(): EqualNode {
    const u = new Vector(
      "u",
      new NumberNode(this.pointB.getXnumber() - this.pointA.getXnumber()),
      new NumberNode(this.pointB.getYnumber() - this.pointA.getYnumber()),
    );
    const b = -u.getXAsNumber();
    const a = u.getYAsNumber();
    const c = -a * this.pointA.getXnumber() - b * this.pointA.getYnumber();
    const x = new VariableNode("x");
    const y = new VariableNode("y");
    return new EqualNode(
      new AddNode(
        new AddNode(
          new MultiplyNode(new NumberNode(a), x).simplify(),
          new MultiplyNode(new NumberNode(b), y).simplify(),
        ),
        new NumberNode(c),
      ).simplify({ forbidFactorize: true }),
      new NumberNode(0),
    );
  }
}
