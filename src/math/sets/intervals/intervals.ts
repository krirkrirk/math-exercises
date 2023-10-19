import { EPSILON } from '#root/math/numbers/epsilon';
import { Integer } from '#root/math/numbers/integer/integer';
import { Nombre, NumberType } from '#root/math/numbers/nombre';
import { Real } from '#root/math/numbers/reals/real';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { coinFlip } from '#root/utils/coinFlip';
import { diceFlip } from '#root/utils/diceFlip';
import { DiscreteSet } from '../discreteSet';
import { MathSet } from '../mathSet';
import { MathSetInterface } from '../mathSetInterface';

export abstract class IntervalConstructor {
  static random() {
    let tex = '';
    const randType = randint(0, 6);
    let a: number, b: number;
    switch (randType) {
      case 0:
        b = randint(-10, 10);
        tex = `]-\\infty;${b}${coinFlip() ? ']' : '['}`;
        break;
      case 1:
        a = randint(-10, 10);
        tex = `${coinFlip() ? ']' : '['}${a};+\\infty[`;
        break;
      case 2:
        a = randint(-10, 10);
        b = randint(a + 1, a + 10);
        tex = `[${a};${b}]`;
        break;
      case 3:
        a = randint(-10, 10);
        b = randint(a + 1, a + 10);
        tex = `]${a};${b}]`;
        break;
      case 4:
        a = randint(-10, 10);
        b = randint(a + 1, a + 10);
        tex = `[${a};${b}[`;
        break;
      case 5:
        a = randint(-10, 10);
        b = randint(a + 1, a + 10);
        tex = `]${a};${b}[`;
        break;
    }
    //-inf; x[
    //[x; inf

    //[a,b]
    //[ [
    //] ]
    //] [
    return new Interval(tex);
  }
}
enum BoundType {
  OO = ']a;b[',
  OF = ']a;b]',
  FO = '[a;b[',
  FF = '[a;b]',
}

export class Interval implements MathSetInterface {
  min: number;
  minTex: string;
  max: number;
  maxTex: string;
  boundType: BoundType;
  leftBracket: '[' | ']';
  rightBracket: '[' | ']';
  leftInequalitySymbol: '\\leq' | '<' | '\\geq' | '>';
  rightInequalitySymbol: '\\leq' | '<' | '\\geq' | '>';

  type: NumberType;
  tex: string;
  /**
   * [[a; b]] pour un interval d'integer;  [a;b] pour des réels
   */
  constructor(tex = '[-10; 10]') {
    if (!tex.includes(';')) throw Error('wrong interval format');
    this.tex = tex;
    const isInt = tex[1] === '[' || tex[1] === ']';
    this.type = isInt ? NumberType.Integer : NumberType.Real;
    const left = tex[0];
    const right = tex[tex.length - 1];
    const [a, b] = tex.slice(isInt ? 2 : 1, isInt ? tex.length - 2 : tex.length - 1).split(';');
    this.minTex = a;
    this.maxTex = b;
    switch (`${left}a;b${right}`) {
      case '[a;b]':
        this.leftBracket = '[';
        this.leftInequalitySymbol = '\\leq';
        this.rightInequalitySymbol = '\\leq';
        this.rightBracket = ']';
        this.boundType = BoundType.FF;
        break;
      case ']a;b[':
        this.leftBracket = ']';
        this.rightBracket = '[';
        this.leftInequalitySymbol = '<';
        this.rightInequalitySymbol = '<';
        this.boundType = BoundType.OO;
        break;
      case '[a;b[':
        this.leftBracket = '[';
        this.rightBracket = '[';
        this.leftInequalitySymbol = '\\leq';
        this.rightInequalitySymbol = '<';
        this.boundType = BoundType.FO;
        break;
      case ']a;b]':
        this.leftBracket = ']';
        this.rightBracket = ']';
        this.leftInequalitySymbol = '<';
        this.rightInequalitySymbol = '\\leq';
        this.boundType = BoundType.OF;
        break;
      default:
        throw console.error('wrong interval format');
    }
    function getBound(bound: string) {
      return bound === '-\\infty'
        ? Number.NEGATIVE_INFINITY
        : bound === '+\\infty'
        ? Number.POSITIVE_INFINITY
        : Number(bound);
    }
    this.min = getBound(a);
    this.max = getBound(b);
  }

  // union(interval: Interval): MathSet {
  //[a,b] [c,d]
  //si a=c return a, max(b,d)
  //si si b = d return min(a,c), b
  //si a=d return c,b sauf si  OXXO
  //si b=c return a,d sauf si XOOX
  //si c > b ou d < a alors union disjointe avec plus petit en 1er
  //sinon return min(a,c), max(b,d)
  //res = a
  // return new MathSet();
  // }
  exclude(nb: number) {
    const rand = () => {
      let x;
      do {
        x = this.getRandomElement();
      } while (x.value === nb);
      return x;
    };
    return new MathSet(this.toTex() + `\\{${nb}\\}`, rand);
  }

  difference(set: DiscreteSet): MathSet {
    const rand = () => {
      let x;
      do {
        x = this.getRandomElement();
      } while (set.includes(x));
      return x;
    };

    return new MathSet(this.toTex() + `\\ ${set.toTex()}`, rand);
  }

  toTex(): string {
    return this.tex;
  }
  insideToTex(): string {
    return this.tex.replaceAll('[', '').replaceAll(']', '');
  }

  toInequality(): string {
    const isLeftClosed = this.boundType === BoundType.FO || this.boundType === BoundType.FF;
    const isRightClosed = this.boundType === BoundType.FF || this.boundType === BoundType.OF;
    if (this.max === Infinity) {
      if (isLeftClosed) {
        return `x \\geq ${this.min}`;
      } else return `x > ${this.min}`;
    } else if (this.min === -Infinity) {
      if (this.boundType === BoundType.OF) {
        return `x \\leq ${this.max}`;
      } else return `x < ${this.max}`;
    }
    return `${this.min} ${isLeftClosed ? '\\leq' : '<'} x ${isRightClosed ? '\\leq' : '<'} ${this.max}`;
  }

  getRandomElement(precision: number = this.type === NumberType.Integer ? 0 : 2): Nombre {
    if (this.min === -Infinity || this.max === Infinity) throw Error("Can't chose amongst infinity");
    let min = this.boundType === BoundType.OO || this.boundType === BoundType.OF ? this.min + EPSILON : this.min;
    let max = this.boundType === BoundType.OO || this.boundType === BoundType.FO ? this.max - EPSILON : this.max;
    const value = round(min + Math.random() * (max - this.min), precision);
    switch (this.type) {
      case NumberType.Integer:
        return new Integer(value);
      default:
        return new Real(value, value.toString());
    }
  }
}
