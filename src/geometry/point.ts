import { Interval } from '../sets/intervals/intervals';
import { MathSet } from '../sets/mathSet';
import { Node } from '../tree/nodes/node';
import { NumberNode } from '../tree/nodes/numbers/numberNode';
import { latexParser } from '../tree/parsers/latexParser';

export abstract class PointConstructor {
  //   static random(domainX: MathSet = new Interval('[[-10; 10]]'), domainY: MathSet = new Interval('[[-10; 10]]')): Point {
  //     const x = domainX.getRandomElement();
  //     const y = domainY.getRandomElement();
  //     return new Point('A', new NumberNode(x.value), new NumberNode(y.value));
  //   }
}

export class Point {
  name: string;
  x: Node;
  y: Node;
  constructor(name: string, x: Node, y: Node) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  toTex(): string {
    return `${this.name}\\left(${latexParser(this.x)} \\right${latexParser(this.y)})`;
  }
}

/**
 * construct random points avec x, y
 * vector a partir des points : calcul des coordonnées
 *
 */
