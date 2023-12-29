import { Node, NodeType } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MathSet } from "../sets/mathSet";
import { Interval } from "../sets/intervals/intervals";
import { Rational } from "../numbers/rationals/rational";

export abstract class PointConstructor {
  static random(
    domainX: MathSet = new Interval("[[-10; 10]]"),
    domainY: MathSet = new Interval("[[-10; 10]]"),
  ): Point {
    const x = domainX.getRandomElement();
    const y = domainY.getRandomElement();
    if (x === null || y === null)
      throw Error("can't build point with thoses sets");
    return new Point("A", new NumberNode(x.value), new NumberNode(y.value));
  }
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
    return `${this.name}\\left(${this.x.toTex()};${this.y.toTex()}\\right)`;
  }
  toCoords(): string {
    return `\\left(${this.x.toTex()};${this.y.toTex()}\\right)`;
  }

  getXnumber(): number {
    if (this.x.type !== NodeType.number)
      throw Error("general point not implemented yet");
    return (this.x as NumberNode).value;
  }

  getYnumber(): number {
    if (this.y.type !== NodeType.number)
      throw Error("general point not implemented yet");
    return (this.y as NumberNode).value;
  }

  midpoint(B: Point, name = "I"): Point {
    const types = [this.x.type, this.y.type, B.x.type, B.y.type];
    if (types.some((type) => type !== NodeType.number)) {
      throw Error("general midpoint not implemented yet");
    }
    return new Point(
      name,
      new Rational((this.x as NumberNode).value + (B.x as NumberNode).value, 2)
        .simplify()
        .toTree(),

      new Rational((this.y as NumberNode).value + (B.y as NumberNode).value, 2)
        .simplify()
        .toTree(),
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
