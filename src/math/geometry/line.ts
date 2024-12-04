import { ToGGBCommandsProps } from "#root/exercises/utils/geogebra/toGGBCommandsProps";
import { randomSegmentName } from "#root/exercises/utils/geometry/randomSegmentName";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { opposite } from "#root/tree/nodes/functions/oppositeNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode, add } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import {
  MultiplyNode,
  multiply,
} from "#root/tree/nodes/operators/multiplyNode";
import {
  SubstractNode,
  substract,
} from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { GeneralSystem } from "../systems/generalSystem";
import { System } from "../systems/system";
import { randint } from "../utils/random/randint";
import { Point, PointConstructor, PointIdentifiers } from "./point";
import { Vector, VectorConstructor } from "./vector";

export type LineIdentifiers = {
  name?: string;
  pointA: PointIdentifiers;
  pointB: PointIdentifiers;
};
export abstract class LineConstructor {
  static random(name?: string) {
    const names = randomSegmentName();
    const points = PointConstructor.randomDifferent(names.split(""));
    return new Line(points[0], points[1], name);
  }
  static fromIdentifiers(identifiers: LineIdentifiers) {
    return new Line(
      PointConstructor.fromIdentifiers(identifiers.pointA),
      PointConstructor.fromIdentifiers(identifiers.pointB),
      identifiers.name,
    );
  }
}
export class Line {
  pointA: Point;
  pointB: Point;
  isVertical: boolean;
  a: AlgebraicNode | undefined;
  b: AlgebraicNode | undefined;
  name: string;
  unformatedName: string;
  ggbName: string;
  constructor(pointA: Point, pointB: Point, name?: string) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.unformatedName = name ?? `${pointA.name}${pointB.name}`;
    this.name = name ?? `\\left(${pointA.name}${pointB.name}\\right)`;
    this.ggbName = name ?? `line_{${pointA.name}${pointB.name}}`;
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

  toIdentifiers() {
    return {
      name: this.unformatedName,
      pointA: this.pointA.toIdentifiers(),
      pointB: this.pointB.toIdentifiers(),
    };
  }
  isParallele(line: Line) {
    if (this.isVertical) {
      return line.isVertical;
    }
    if (line.isVertical) {
      return this.isVertical;
    }
    const vec = VectorConstructor.fromPoints(this.pointA, this.pointB);
    const lineVec = VectorConstructor.fromPoints(line.pointA, line.pointB);
    return vec.isColinear(lineVec);
  }

  getParallele(point: Point) {
    if (this.isVertical) {
      const y = add(point.y, 1).simplify();
      const secondPoint = new Point("P", point.x, y);
      return new Line(point, secondPoint);
    }
    const x = new AddNode(point.x, new NumberNode(1)).simplify();
    const y = new AddNode(point.y, this.a!).simplify();
    const secondPoint = new Point("P", x, y);
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

  toCartesian() {
    const { a, b, c } = this.toCartesianCoeffs();

    return add(add(multiply(a, "x"), multiply(b, "x")), c);
  }

  toCartesianCoeffs() {
    //ax+by+c = 0
    //u(-b,a)
    //axA+byA+c = 0 donc c = -axA-byA
    const u = VectorConstructor.fromPoints(this.pointA, this.pointB);
    const a = u.y;
    const b = opposite(u.x);
    // const a = u.getYAsNumber();
    const c = substract(
      opposite(multiply(a, this.pointA.x)),
      multiply(b, this.pointA.y),
    );
    return { a, b, c };
  }
  toTex() {
    return this.name;
  }
  toTexNoLeftRight() {
    return this.name.replace("\\left", "").replace("\\right", "");
  }

  toGGBCommands(
    shouldBuildPoints: boolean,
    {
      isFixed = true,
      showLabel = false,
      showUnderlyingPointsLabel = true,
    }: ToGGBCommandsProps = {},
  ) {
    const commands = [
      `${this.ggbName}=Line(${this.pointA.name},${this.pointB.name})`,
      `SetFixed(${this.ggbName},${isFixed ? "true" : "false"})`,
      `ShowLabel(${this.ggbName},${showLabel ? "true" : "false"})`,
    ];
    if (shouldBuildPoints) {
      const ACommands = this.pointA.toGGBCommand({
        isFixed,
        showLabel: showUnderlyingPointsLabel,
      });
      const BCommands = this.pointB.toGGBCommand({
        isFixed,
        showLabel: showUnderlyingPointsLabel,
      });
      commands.unshift(...ACommands, ...BCommands);
    }
    return commands;
  }

  intersect(line: Line, intersectName?: string) {
    if (line.isParallele(this)) throw Error("Lines are parallel");
    const { a, b, c } = this.toCartesianCoeffs();
    const { a: a2, b: b2, c: c2 } = line.toCartesianCoeffs();
    const sys = new GeneralSystem([
      [a, b, opposite(c)],
      [a2, b2, opposite(c2)],
    ]);
    const solve = sys.solve();
    return new Point(intersectName ?? "I", solve.x, solve.y);
  }
}
