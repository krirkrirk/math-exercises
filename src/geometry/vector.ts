import { Node } from '../tree/nodes/node';
import { SubstractNode } from '../tree/nodes/operators/substractNode';
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
}
