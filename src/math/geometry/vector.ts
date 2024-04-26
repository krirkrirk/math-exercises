import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { Node, NodeType } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { randint } from "../utils/random/randint";
import { Point } from "./point";

export abstract class VectorConstructor {
  static fromPoints(origin: Point, end: Point): Vector {
    return new Vector(
      `${origin.name}${end.name}`,
      new SubstractNode(end.x, origin.x).simplify(),
      new SubstractNode(end.y, origin.y).simplify(),
    );
  }
  static random(name: string, allowNull = true): Vector {
    const x = new NumberNode(randint(-10, 11));
    const y = new NumberNode(
      randint(-10, 11, !allowNull && x.value === 0 ? [0] : undefined),
    );
    return new Vector(name, x, y);
  }
}

export class Vector {
  name: string;
  tex: string;
  x: AlgebraicNode;
  y: AlgebraicNode;
  constructor(name: string, x: AlgebraicNode, y: AlgebraicNode) {
    this.name = name;
    this.tex = `\\overrightarrow{${name}}`;
    this.x = x;
    this.y = y;
  }

  toTex(): string {
    return `\\overrightarrow{${this.name}}`;
  }

  toTexWithCoords(): string {
    return `\\overrightarrow{${
      this.name
    }}\\begin{pmatrix}${this.x.toTex()} \\\\ ${this.y.toTex()} \\end{pmatrix}`;
  }

  toInlineCoordsTex(): string {
    return `\\left(${this.x.simplify().toTex()};${this.y
      .simplify()
      .toTex()}\\right)`;
  }

  isColinear(v: Vector): boolean {
    const det = this.determinant(v);
    return det.evaluate({}) === 0;
  }
  determinant(v: Vector): AlgebraicNode {
    if (
      [this.x.type, this.y.type, v.x.type, v.y.type].some(
        (el) => el !== NodeType.number,
      )
    )
      throw Error("general determinant not implemented");
    const xValue = (this.x as NumberNode).value;
    const yValue = (this.y as NumberNode).value;
    const vxValue = (v.x as NumberNode).value;
    const vyValue = (v.y as NumberNode).value;
    return new NumberNode(xValue * vyValue - yValue * vxValue);
  }

  times(k: AlgebraicNode, name?: string) {
    return new Vector(
      name ?? "v",
      new MultiplyNode(this.x, k).simplify(),
      new MultiplyNode(this.y, k).simplify(),
    );
  }
  scalarProduct(v: Vector): Node {
    if (
      [this.x.type, this.y.type, v.x.type, v.y.type].some(
        (el) => el !== NodeType.number,
      )
    )
      throw Error("general determinant not implemented");
    const xValue = (this.x as NumberNode).value;
    const yValue = (this.y as NumberNode).value;
    const vxValue = (v.x as NumberNode).value;
    const vyValue = (v.y as NumberNode).value;
    return new NumberNode(xValue * vxValue + yValue * vyValue);
  }

  add(v: Vector): Vector {
    const x = v.x;
    const y = v.y;
    const resultX = new AddNode(this.x, x);
    const resultY = new AddNode(this.y, y);
    return new Vector(
      `${this.name}+${v.name}`,
      resultX.simplify(),
      resultY.simplify(),
    );
  }

  getNorm(): AlgebraicNode {
    const xValue = (this.x.simplify() as NumberNode).value;
    const yValue = (this.y.simplify() as NumberNode).value;
    return new SqrtNode(
      new AddNode(
        new SquareNode(new NumberNode(xValue)),
        new SquareNode(new NumberNode(yValue)),
      ),
    );
  }
  getEndPoint(startPoint: Point, name?: string) {
    return new Point(
      name ?? "B",
      new AddNode(startPoint.x, this.x).simplify(),
      new AddNode(startPoint.y, this.y).simplify(),
    );
  }
  equals(v: Vector) {
    return this.x.equals(v.x) && this.y.equals(v.y);
  }
}
