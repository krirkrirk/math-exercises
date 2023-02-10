import { Node } from '../tree/nodes/node';
import { AddNode } from '../tree/nodes/operators/addNode';
import { MultiplyNode } from '../tree/nodes/operators/multiplyNode';
import { SubstractNode } from '../tree/nodes/operators/substractNode';
import { latexParser } from '../tree/parsers/latexParser';
import { Point } from './point';

export abstract class VectorConstructor {
  static fromPoints(origin: Point, end: Point): Vector {
    return new Vector(
      `${origin.name}${end.name}`,
      new SubstractNode(end.x, origin.x),
      new SubstractNode(end.y, origin.y),
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
    return `\\overrightarrow{${this.name}}\\begin{pmatrix}${latexParser(this.x)} \\${latexParser(this.y)} \\end{pmatrix}`;
  }

  scalarProduct(v: Vector): Node {
    return new AddNode(
      new MultiplyNode(this.x, v.x),
      new MultiplyNode(this.y, v.y)
    )
  }
}
