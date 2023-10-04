import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { randint } from '../utils/random/randint';
import { Point } from './point';

export abstract class VectorConstructor {
  static fromPoints(origin: Point, end: Point): Vector {
    return new Vector(
      `${origin.name}${end.name}`,
      new SubstractNode(end.x, origin.x),
      new SubstractNode(end.y, origin.y),
    );
  }
  static random(name: string): Vector {
    return new Vector(name, new NumberNode(randint(-10, 11)), new NumberNode(randint(-10, 11)));
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
    return `\\overrightarrow{${this.name}}\\begin{pmatrix}${this.x.toTex()} \\\\ ${this.y.toTex()} \\end{pmatrix}`;
  }

  determinant(v: Vector): Node {
    return simplifyNode(new SubstractNode(new MultiplyNode(this.x, v.y), new MultiplyNode(this.y, v.x)));
  }
  scalarProduct(v: Vector): Node {
    return simplifyNode(new AddNode(new MultiplyNode(this.x, v.x), new MultiplyNode(this.y, v.y)));
  }
}
