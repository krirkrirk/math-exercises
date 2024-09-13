import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { Node, NodeType } from "#root/tree/nodes/node";
import { NumberNode, isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { randint } from "../utils/random/randint";
import { Point } from "./point";
import { SpacePoint } from "./spacePoint";

export abstract class SpaceVectorConstructor {
  static fromPoints(origin: SpacePoint, end: SpacePoint): SpaceVector {
    return new SpaceVector(
      `${origin.name}${end.name}`,
      new SubstractNode(end.x, origin.x).simplify(),
      new SubstractNode(end.y, origin.y).simplify(),
      new SubstractNode(end.z, origin.z).simplify(),
    );
  }
  static random(name: string, allowNull = true): SpaceVector {
    let x: number;
    let y: number;
    let z: number;
    do {
      x = randint(-10, 11);
      y = randint(-10, 11);
      z = randint(-10, 11);
    } while (!allowNull && x === 0 && y === 0 && z === 0);

    return new SpaceVector(name, x.toTree(), y.toTree(), z.toTree());
  }
  static randomDifferents(names: string[], allowNull = true): SpaceVector[] {
    const res: SpaceVector[] = [];
    for (let i = 0; i < names.length; i++) {
      let vec: SpaceVector;
      do {
        vec = SpaceVectorConstructor.random(names[i], allowNull);
      } while (res.some((v) => v.equals(vec)));
      res.push(vec);
    }
    return res;
  }
}

export class SpaceVector {
  name: string;
  tex: string;
  x: AlgebraicNode;
  y: AlgebraicNode;
  z: AlgebraicNode;
  constructor(
    name: string,
    x: AlgebraicNode,
    y: AlgebraicNode,
    z: AlgebraicNode,
  ) {
    this.name = name;
    this.tex = `\\overrightarrow{${name}}`;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toTex(): string {
    return `\\overrightarrow{${this.name}}`;
  }

  toCoordsTex(): string {
    return `\\begin{pmatrix}${this.x.toTex()} \\\\ ${this.y.toTex()} \\\\ ${this.z.toTex()} \\end{pmatrix}`;
  }
  toInlineCoordsTex(): string {
    return `\\left(${this.x.simplify().toTex()};${this.y
      .simplify()
      .toTex()};${this.z.simplify().toTex()}\\right)`;
  }
  toTexWithCoords(): string {
    return `\\overrightarrow{${
      this.name
    }}\\begin{pmatrix}${this.x.toTex()} \\\\ ${this.y.toTex()} \\\\ ${this.z.toTex()} \\end{pmatrix}`;
  }

  isColinear(v: SpaceVector): boolean {
    throw Error("unimplemented");
  }
  determinant(v: SpaceVector): AlgebraicNode {
    throw Error("unimplemented");
  }

  times(k: AlgebraicNode, name?: string) {
    return new SpaceVector(
      name ?? "v",
      new MultiplyNode(this.x, k).simplify(),
      new MultiplyNode(this.y, k).simplify(),
      new MultiplyNode(this.z, k).simplify(),
    );
  }
  scalarProduct(v: SpaceVector): Node {
    throw Error("unimplemented");
  }

  add(v: SpaceVector): SpaceVector {
    return new SpaceVector(
      `${this.name}+${v.name}`,
      new AddNode(this.x, v.x).simplify(),
      new AddNode(this.y, v.y).simplify(),
      new AddNode(this.z, v.z).simplify(),
    );
  }

  getNorm(): AlgebraicNode {
    return new SqrtNode(
      new AddNode(
        new SquareNode(this.x),
        new AddNode(
          new SquareNode(this.y),

          new SquareNode(this.z),
        ),
      ),
    ).simplify();
  }
  getEndPoint(startPoint: SpacePoint, name?: string) {
    return new SpacePoint(
      name ?? "B",
      new AddNode(startPoint.x, this.x).simplify(),
      new AddNode(startPoint.y, this.y).simplify(),
      new AddNode(startPoint.z, this.z).simplify(),
    );
  }
  equals(v: SpaceVector) {
    return this.x.equals(v.x) && this.y.equals(v.y) && this.z.equals(v.z);
  }
}
