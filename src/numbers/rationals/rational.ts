import { Expression } from "../../expression/expression";
import { gcd } from "../../mathutils/arithmetic/gcd";

export class Rational implements Expression {
  num: number;
  denum: number;
  isSimplified: boolean;

  constructor(numerator: number, denumerator: number) {
    this.num = numerator;
    this.denum = denumerator;
    this.isSimplified = Math.abs(gcd(numerator, denumerator)) === 1;
  }

  toTex() {
    return `\\frac{${this.num}}{${this.denum}}`;
  }
  
  add(expression: Expression): Expression {

  }

  opposite(): Expression {
    return new Rational(-this.num, this.denum);
  }

  simplify(): Rational {
    const div = Math.abs(gcd(this.num, this.denum));
    if (this.denum === div) return;
    return new Rational(this.num / div, this.denum / div);
  }
}
