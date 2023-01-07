import { Expression } from "../../expression/expression";
import { gcd } from "../../mathutils/arithmetic/gcd";
import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { DivideNode } from "../../tree/nodes/operators/divideNode";
import { Integer } from "../integer/integer";
import { Nombre } from "../nombre";

export class Rational implements Nombre {
  num: number;
  denum: number;
  tex: string;
  value: number;
  isSimplified: boolean;

  constructor(numerator: number, denumerator: number) {
    this.num = numerator;
    this.denum = denumerator;
    this.value = numerator / denumerator;
    this.isSimplified = Math.abs(gcd(numerator, denumerator)) === 1;
    this.tex = `\\frac{${this.num}}{${this.denum}}`;
  }

  toTex() {
    return `\\frac{${this.num}}{${this.denum}}`;
  }

  add(expression: Expression): Expression {
    return this;
  }

  multiply(expression: Expression): Expression {
    return this;
  }

  opposite(): Rational {
    return new Rational(-this.num, this.denum);
  }

  toTree(): Node {
    return new DivideNode(new NumberNode(this.num), new NumberNode(this.denum));
  }

  simplify(): Nombre {
    const sign =
      (this.num > 0 && this.denum > 0) || (this.num < 0 && this.denum < 0)
        ? 1
        : -1;
    const div = Math.abs(gcd(this.num, this.denum));
    if (Math.abs(this.denum) === div) return new Integer(this.num / this.denum);
    return new Rational(
      (sign * Math.abs(this.num)) / div,
      Math.abs(this.denum) / div
    );
  }
}
