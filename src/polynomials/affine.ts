import { Rational } from "../numbers/rationals/rational";
import { Interval } from "../sets/intervals/intervals";
import { Polynomial } from "./polynomial";
import { DiscreteSet } from "../sets/discreteSet";
import { MathSet } from "../sets/mathSet";

export abstract class AffineConstructor {
  static random(
    domainA: MathSet<number> = new Interval("[[-10; 10]]").difference(new DiscreteSet([0])),
    domainB: MathSet<number> = new Interval("[[-10; 10]]")
  ): Affine {
    const a = domainA.getRandomElement();
    const b = domainB.getRandomElement();
    return new Affine(a, b);
  }

  static differentRandoms(
    nb: number,
    domainA: MathSet<number> = new Interval("[[-10; 10]]").difference(new DiscreteSet([0])),
    domainB: MathSet<number> = new Interval("[[-10; 10]]")
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

  // static add(aff1: Affine, aff2: Affine | number): Affine {
  //   if(typeof aff2)
  // }
  // static randomWithIntegerRoot(): Affine {
  //   const root = randint(-10, 10);
  // }
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

  getRoot(): string {
    return new Rational(-this.b, this.a).simplify().toTex();
  }

  toString(): string {
    return super.toTex();
  }
}
