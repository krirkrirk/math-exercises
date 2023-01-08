import { Expression } from "../../expression/expression";
import { coprimesOf } from "../../mathutils/arithmetic/coprimesOf";
import { gcd } from "../../mathutils/arithmetic/gcd";
import { lcd } from "../../mathutils/arithmetic/lcd";
import { randint } from "../../mathutils/random/randint";
import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { DivideNode } from "../../tree/nodes/operators/divideNode";
import { random } from "../../utils/random";
import { shuffle } from "../../utils/shuffle";
import { Integer } from "../integer/integer";
import { Nombre, NumberType } from "../nombre";

export abstract class RationalConstructor {
  /**
   * @param maxGcd max number by which the fraction is simplifiable
   */
  static randomSimplifiable(maxGcd: number = 10) {
    const gcd = randint(2, maxGcd);
    const max = randint(3, 11);
    const min = random(coprimesOf(max));
    let [num, denum]: number[] = shuffle([gcd * min, gcd * max]);
    if (denum === gcd) {
      //si 10/2 on transforme en 2/10
      return new Rational(denum, num);
    }
    return new Rational(num, denum);
  }
  static randomIrreductible(max: number = 11) {
    const a = randint(2, max);
    const b = random([...coprimesOf(a), 1]);
    if (b === 1) return new Rational(b, a);
    const [num, denum] = shuffle([a, b]);
    return new Rational(num, denum);
  }
}

export class Rational implements Nombre {
  num: number;
  denum: number;
  tex: string;
  value: number;
  isSimplified: boolean;
  type: NumberType;

  constructor(numerator: number, denumerator: number) {
    this.num = numerator;
    this.denum = denumerator;
    this.value = numerator / denumerator;
    this.isSimplified = Math.abs(gcd(numerator, denumerator)) === 1;
    this.tex = `\\frac{${this.num}}{${this.denum}}`;
    this.type = NumberType.Rational;
  }

  toTex() {
    return `\\frac{${this.num}}{${this.denum}}`;
  }

  add(nb: Nombre): Nombre {
    switch (nb.type) {
      case NumberType.Integer: {
        const num = this.num + this.denum * nb.value;
        return new Rational(num, this.denum).simplify();
      }
      case NumberType.Rational: {
        const rational = nb as Rational;
        const ppcm = lcd(rational.denum, this.denum);
        const num = this.num * (ppcm / this.denum) + rational.num * (ppcm / rational.denum);
        return new Rational(num, ppcm).simplify();
      }
    }
    throw Error("not implemented yet");
  }

  multiply(nb: Nombre): Nombre {
    switch (nb.type) {
      case NumberType.Integer: {
        const num = this.num * nb.value;
        const denum = this.denum * nb.value;
        return new Rational(num, denum).simplify();
      }
      case NumberType.Rational: {
        const rational = nb as Rational;
        const num = this.num * rational.num;
        const denum = this.denum * rational.denum;
        return new Rational(num, denum).simplify();
      }
    }
    throw Error("not implemented yet");
  }

  opposite(): Rational {
    return new Rational(-this.num, this.denum);
  }

  toTree(): Node {
    return new DivideNode(new NumberNode(this.num), new NumberNode(this.denum));
  }

  simplify(): Nombre {
    const sign = (this.num > 0 && this.denum > 0) || (this.num < 0 && this.denum < 0) ? 1 : -1;
    const div = Math.abs(gcd(this.num, this.denum));
    if (Math.abs(this.denum) === div) return new Integer(this.num / this.denum);
    return new Rational((sign * Math.abs(this.num)) / div, Math.abs(this.denum) / div);
  }
}
