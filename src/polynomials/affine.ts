import { Rational } from "../numbers/rationals/rational";
import { Interval } from "../sets/intervals/intervals";
import { Polynomial } from "./polynomial";
import { DiscreteSet } from "../sets/discreteSet";
import { MathSet } from "../sets/mathSet";
import { Integer } from "../numbers/integer/integer";
import { Node, NodeType } from "../tree/nodes/node";
import { MultiplyNode } from "../tree/nodes/operators/multiplyNode";
import { NumberNode } from "../tree/nodes/numbers/numberNode";
import { VariableNode } from "../tree/nodes/variables/variableNode";
import { AddNode } from "../tree/nodes/operators/addNode";
import { Nombre } from "../numbers/nombre";

export abstract class AffineConstructor {
  static random(
    domainA: MathSet = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0)])),
    domainB: MathSet = new Interval("[[-10; 10]]")
  ): Affine {
    const a = domainA.getRandomElement();
    const b = domainB.getRandomElement();
    return new Affine(a.value, b.value);
  }

  static differentRandoms(
    nb: number,
    domainA: MathSet = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0)])),
    domainB: MathSet = new Interval("[[-10; 10]]")
  ): Affine[] {
    const res: Affine[] = [];
    for (let i = 0; i < nb; i++) {
      let aff: Affine;
      do {
        aff = AffineConstructor.random(domainA, domainB);
      } while (res.some((affine) => affine.equals(aff)));
      res.push(aff);
    }
    return res;
  }
}

export class Affine extends Polynomial {
  a: number;
  b: number;
  variable: string;

  constructor(a: number, b: number, variable: string = "x") {
    super([b, a], variable);
    this.a = a;
    this.b = b;
    this.variable = variable;
  }

  getRoot(): Nombre {
    return new Rational(-this.b, this.a).simplify();
  }

  toString(): string {
    return super.toTex();
  }
}
