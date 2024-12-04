import { coprimesOf } from "#root/math/utils/arithmetic/coprimesOf";
import { gcd } from "#root/math/utils/arithmetic/gcd";
import { lcd } from "#root/math/utils/arithmetic/lcd";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { Node, NodeOptions } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { shuffle } from "#root/utils/alea/shuffle";
import { doWhile } from "#root/utils/doWhile";
import { Decimal } from "../decimals/decimal";
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
  static randomIrreductibleProba(maxDenum: number = 11) {
    const b = randint(2, maxDenum);
    const a = randint(1, b);
    return new Rational(a, b).simplify();
  }
  static randomIrreductibleWithSign(max: number = 11) {
    const sign = coinFlip() ? 1 : -1;
    const a = randint(2, max);
    const b = random([...coprimesOf(a), 1]);
    if (b === 1) return new Rational(sign * b, a);
    const [num, denum] = shuffle([a, b]);
    return new Rational(sign * num, denum);
  }
  static randomPureRational(max: number = 20) {
    const frac = doWhile(
      () => RationalConstructor.randomIrreductible(max),
      (x) => round(x.value, 10) === x.value,
    );
    return frac;
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
    if (denumerator === 0) throw Error("division by zero");
    this.num = numerator;
    this.denum = denumerator;
    this.value = numerator / denumerator;
    this.isSimplified = Math.abs(gcd(numerator, denumerator)) === 1;
    this.tex = `${this.num < 0 ? "-" : ""}\\frac{${
      this.num < 0 ? -this.num : this.num
    }}{${this.denum}}`;
    this.type = NumberType.Rational;
  }

  equals(n: Nombre) {
    return this.value === n.value;
  }
  toTex() {
    return `${this.num < 0 ? "-" : ""}\\frac{${
      this.num < 0 ? -this.num : this.num
    }}{${this.denum}}`;
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
        const num =
          this.num * (ppcm / this.denum) +
          rational.num * (ppcm / rational.denum);
        return new Rational(num, ppcm).simplify();
      }
    }
    throw Error("not implemented yet");
  }

  multiply(nb: Nombre): Rational | Integer {
    switch (nb.type) {
      case NumberType.Integer: {
        const num = this.num * nb.value;
        const denum = this.denum;
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
  reverse(shouldSimplify: boolean): Nombre {
    const frac = new Rational(this.denum, this.num);
    return shouldSimplify ? frac.simplify() : frac;
  }
  divide(nb: Nombre): Nombre {
    switch (nb.type) {
      case NumberType.Integer: {
        const denum = this.denum * nb.value;
        return new Rational(this.num, denum).simplify();
      }
      case NumberType.Rational: {
        const rational = nb as Rational;
        const num = this.num * rational.denum;
        const denum = this.denum * rational.num;
        return new Rational(num, denum).simplify();
      }
    }
    throw Error("not implemented yet");
  }

  opposite(): Rational {
    return new Rational(-this.num, this.denum);
  }

  toTree(opts?: NodeOptions) {
    if (this.num < 0)
      return new OppositeNode(
        new FractionNode(
          new NumberNode(-this.num),
          new NumberNode(this.denum),
          opts,
        ),
      );
    return new FractionNode(
      new NumberNode(this.num),
      new NumberNode(this.denum),
      opts,
    );
  }

  isIrreductible() {
    return this.denum !== 1 && gcd(this.num, this.denum) === 1;
  }

  simplify(): Integer | Rational {
    const sign = this.num * this.denum > 0 ? 1 : -1;
    let intNum = this.num;
    let intDenum = this.denum;
    if (Math.floor(intNum) !== intNum || Math.floor(intDenum) !== intDenum) {
      const numDec = new Decimal(intNum);
      const denumDec = new Decimal(intDenum);
      const numPrec = numDec.precision;
      const denumPrec = denumDec.precision;
      const totalPrec = Math.max(numPrec, denumPrec);
      intNum = numDec.multiplyByPowerOfTen(totalPrec).value;
      intDenum = denumDec.multiplyByPowerOfTen(totalPrec).value;
    }
    const div = Math.abs(gcd(intNum, intDenum));

    if (Math.abs(intDenum) === div) return new Integer(intNum / intDenum);
    return new Rational(
      (sign * Math.abs(intNum)) / div,
      Math.abs(intDenum) / div,
    );
  }
}
