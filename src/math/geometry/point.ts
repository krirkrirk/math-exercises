import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { evaluate } from 'mathjs';

export abstract class PointConstructor {
  // static random(domainX: MathSet = new Interval('[[-10; 10]]'), domainY: MathSet = new Interval('[[-10; 10]]')): Point {
  //   const x = domainX.getRandomElement();
  //   const y = domainY.getRandomElement();
  //   return new Point('A', new NumberNode(x.value), new NumberNode(y.value));
  // }
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
    return `${this.name}\\left(${this.x.toTex()}; ${this.y.toTex()}\\right)`;
  }

  getXnumber(): number {
    return evaluate(this.x.toMathString());
  }

  getYnumber(): number {
    return evaluate(this.y.toMathString());
  }

  midpoint(B: Point, name = 'I'): Point {
    return new Point(
      name,
      simplifyNode(new FractionNode(new AddNode(this.x, B.x), new NumberNode(2))),
      simplifyNode(new FractionNode(new AddNode(this.y, B.y), new NumberNode(2))),
    );
  }

  distanceTo(B: Point): number {
    const dx = this.getXnumber() - B.getXnumber();
    const dy = this.getYnumber() - B.getYnumber();
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}

/**
 * Droite{
 * constructor : 
 *  depuis 2 points : A,B --> Droite
 *  depuis 1 point + coeff dir --> Droite
 *  avec une équation de droite --> Droite
 * 
 * méthodes : 
 *    toEquation() --> y = 3x+2
 *    toCoeffDIr --> a

 * }
 */
