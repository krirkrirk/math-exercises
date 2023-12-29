import { Node, NodeType } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { randint } from "../utils/random/randint";
import { Point } from "./point";

export abstract class VectorConstructor {
  static fromPoints(origin: Point, end: Point): Vector {
    return new Vector(
      `${origin.name}${end.name}`,
      new SubstractNode(end.x, origin.x),
      new SubstractNode(end.y, origin.y),
    );
  }
  static random(name: string): Vector {
    return new Vector(
      name,
      new NumberNode(randint(-10, 11)),
      new NumberNode(randint(-10, 11)),
    );
  }
}

export class Vector {
  name: string;
  tex: string;
  x: Node;
  y: Node;
  constructor(name: string, x: Node, y: Node) {
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

  determinant(v: Vector): Node {
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
}
