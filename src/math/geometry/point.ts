import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { Node, NodeType } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { simplifyNode } from "#root/tree/parsers/simplify";
import { evaluate } from "mathjs";
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
    return evaluate(this.x.toMathString());
  }

  getYnumber(): number {
    return evaluate(this.y.toMathString());
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

  distanceToNode(B: Point): Node {
    const dx = new SubstractNode(this.x, B.x);
    const dy = new SubstractNode(this.y, B.y);
    const sum = new AddNode(
      new PowerNode(dx, new NumberNode(2)),
      new PowerNode(dy, new NumberNode(2)),
    );
    return new SqrtNode(simplifyNode(sum));
  }

  equalTo(B: Point): boolean {
    return (
      this.getXnumber() === B.getXnumber() &&
      this.getYnumber() === B.getYnumber()
    );
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
