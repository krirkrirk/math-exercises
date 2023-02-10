import { Interval } from '../sets/intervals/intervals';
import { MathSet } from '../sets/mathSet';
import { Node } from '../tree/nodes/node';
import { NumberNode } from '../tree/nodes/numbers/numberNode';
import { AddNode } from '../tree/nodes/operators/addNode';
import { FractionNode } from '../tree/nodes/operators/fractionNode';
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
    return `${this.name}`;
  }
  toTexWithCoords(): string {
    return `${this.name}\\left(${latexParser(this.x)}; ${latexParser(this.y)}\\right)`;
  }

  midpoint(B : Point, name = "I"):Point{
    return new Point(name, 
      new FractionNode(
        new AddNode(this.x, B.x), 
        new NumberNode(2)
      ),
      new FractionNode(
        new AddNode(this.y, B.y), 
        new NumberNode(2)
      )
    )
  }
}
