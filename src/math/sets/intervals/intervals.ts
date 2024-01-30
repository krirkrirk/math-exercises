import { EPSILON } from "#root/math/numbers/epsilon";
import { Integer } from "#root/math/numbers/integer/integer";
import { Nombre, NumberType } from "#root/math/numbers/nombre";
import { Real } from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { ClosureType, IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/coinFlip";
import { diceFlip } from "#root/utils/diceFlip";
import { DiscreteSet } from "../discreteSet";
import { MathSet } from "../mathSet";
import { MathSetInterface } from "../mathSetInterface";

export abstract class IntervalConstructor {
  static random() {
    let tex = "";
    const randType = randint(0, 6);
    let a: number, b: number;
    switch (randType) {
      case 0:
        b = randint(-10, 10);
        tex = `]-\\infty;${b}${coinFlip() ? "]" : "["}`;
        break;
      case 1:
        a = randint(-10, 10);
        tex = `${coinFlip() ? "]" : "["}${a};+\\infty[`;
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
    return new Interval(tex);
  }
  static differentRandoms(nb: number) {
    const res: Interval[] = [];
    for (let i = 0; i < nb; i++) {
      let interval: Interval;
      do {
        interval = this.random();
      } while (res.some((int) => int.tex === interval.tex));
      res.push(this.random());
    }
    return res;
  }
}

export class Interval implements MathSetInterface {
  min: number;
  minTex: string;
  max: number;
  maxTex: string;
  closure: ClosureType;
  leftBracket: "[" | "]";
  rightBracket: "[" | "]";
  leftInequalitySymbol: "\\le" | "<" | "\\ge" | ">";
  rightInequalitySymbol: "\\le" | "<" | "\\ge" | ">";

  type: NumberType;
  tex: string;
  /**
   * [[a; b]] pour un interval d'integer;  [a;b] pour des réels
   */
  constructor(tex = "[-10; 10]") {
    if (!tex.includes(";")) throw Error("wrong interval format");
    this.tex = tex;
    const isInt = tex[1] === "[" || tex[1] === "]";
    this.type = isInt ? NumberType.Integer : NumberType.Real;
    const left = tex[0];
    const right = tex[tex.length - 1];
    const [a, b] = tex
      .slice(isInt ? 2 : 1, isInt ? tex.length - 2 : tex.length - 1)
      .split(";");
    this.minTex = a;
    this.maxTex = b;
    switch (`${left}a;b${right}`) {
      case "[a;b]":
        this.leftBracket = "[";
        this.leftInequalitySymbol = "\\le";
        this.rightInequalitySymbol = "\\le";
        this.rightBracket = "]";
        this.closure = ClosureType.FF;
        break;
      case "]a;b[":
        this.leftBracket = "]";
        this.rightBracket = "[";
        this.leftInequalitySymbol = "<";
        this.rightInequalitySymbol = "<";
        this.closure = ClosureType.OO;
        break;
      case "[a;b[":
        this.leftBracket = "[";
        this.rightBracket = "[";
        this.leftInequalitySymbol = "\\le";
        this.rightInequalitySymbol = "<";
        this.closure = ClosureType.FO;
        break;
      case "]a;b]":
        this.leftBracket = "]";
        this.rightBracket = "]";
        this.leftInequalitySymbol = "<";
        this.rightInequalitySymbol = "\\le";
        this.closure = ClosureType.OF;
        break;
      default:
        throw console.error("wrong interval format");
    }
    function getBound(bound: string) {
      return bound === "-\\infty"
        ? Number.NEGATIVE_INFINITY
        : bound === "+\\infty"
        ? Number.POSITIVE_INFINITY
        : Number(bound);
    }
    this.min = getBound(a);
    this.max = getBound(b);
  }

  union(interval: Interval): MathSet {
    let unionRightBracket =
      this.max > interval.max
        ? this.rightBracket
        : this.max === interval.max
        ? this.rightBracket === "]" || interval.rightBracket === "]"
          ? "]"
          : "["
        : interval.rightBracket;
    let unionLeftBracket =
      this.min < interval.min
        ? this.leftBracket
        : this.max === interval.max
        ? this.leftBracket === "[" || interval.leftBracket === "["
          ? "["
          : "]"
        : interval.leftBracket;
    let min = Math.min(this.min, interval.min);
    let minTex = this.min < interval.min ? this.minTex : interval.minTex;
    let max = Math.max(this.max, interval.max);
    let maxTex = this.max > interval.max ? this.maxTex : interval.maxTex;

    if (
      this.max < interval.min ||
      this.min > interval.max ||
      (this.max === interval.min &&
        this.rightBracket === "[" &&
        interval.leftBracket === "]") ||
      (this.min === interval.max &&
        this.leftBracket === "]" &&
        interval.rightBracket === "[")
    ) {
      const firstInterval = this.min < interval.min ? this : interval;
      const secondInterval = this.min < interval.min ? interval : this;
      return new MathSet(
        `${unionLeftBracket}${firstInterval.minTex};${firstInterval.maxTex}${firstInterval.rightBracket}\\cup${secondInterval.leftBracket}${secondInterval.minTex};${secondInterval.maxTex}${unionRightBracket}`,
        () =>
          coinFlip()
            ? firstInterval.getRandomElement()
            : secondInterval.getRandomElement(),
      );
    } else {
      return new Interval(
        `${unionLeftBracket}${minTex};${maxTex}${unionRightBracket}`,
      );
    }
  }

  intersection(interval: Interval): MathSet {
    const a = this.min;
    const b = this.max;
    const c = interval.min;
    const d = interval.max;
    //[a,b] n [c,d]

    const isDisjoint =
      b < c ||
      d < a ||
      (b === c &&
        (this.rightBracket === "[" || interval.leftBracket === "]")) ||
      (a === d && (interval.rightBracket === "[" || this.leftBracket === "]"));
    if (isDisjoint) {
      return new MathSet("\\emptyset", () => null);
    }
    const winningLeftBracket = (brack1: "]" | "[", brack2: "]" | "[") =>
      brack1 === "]" || brack2 === "]" ? "]" : "[";
    const winningRightBracket = (brack1: "]" | "[", brack2: "]" | "[") =>
      brack1 === "[" || brack2 === "[" ? "[" : "]";
    let min = Math.max(a, c);
    let minTex = a >= c ? this.minTex : interval.minTex;
    let leftBracket =
      a === c
        ? winningLeftBracket(this.leftBracket, interval.leftBracket)
        : a > c
        ? this.leftBracket
        : interval.leftBracket;

    const max = Math.min(b, d);
    let maxTex = b <= d ? this.maxTex : interval.maxTex;

    let rightBracket =
      b === d
        ? winningRightBracket(this.rightBracket, interval.rightBracket)
        : b < d
        ? this.rightBracket
        : interval.rightBracket;

    return new Interval(`${leftBracket}${minTex};${maxTex}${rightBracket}`);
  }

  exclude(nb: number) {
    const rand = () => {
      let x;
      do {
        x = this.getRandomElement();
      } while (x.value === nb);
      return x;
    };
    return new MathSet(this.toTex() + `\\left\\{${nb}\\right\\}`, rand);
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
  insideToTex(): string {
    return this.tex.replaceAll("[", "").replaceAll("]", "");
  }
  toTex(): string {
    return `${this.leftBracket}${this.insideToTex()}${this.rightBracket}`;
  }

  toInequality(): string {
    const isLeftClosed =
      this.closure === ClosureType.FO || this.closure === ClosureType.FF;
    const isRightClosed =
      this.closure === ClosureType.FF || this.closure === ClosureType.OF;
    if (this.max === Infinity) {
      if (isLeftClosed) {
        return `x\\ge${this.min}`;
      } else return `x>${this.min}`;
    } else if (this.min === -Infinity) {
      if (this.closure === ClosureType.OF) {
        return `x\\le${this.max}`;
      } else return `x<${this.max}`;
    }
    return `${this.min}${isLeftClosed ? "\\le x" : "<x"}${
      isRightClosed ? "\\le" : "<"
    }${this.max}`;
  }

  getRandomElement(
    precision: number = this.type === NumberType.Integer ? 0 : 2,
  ): Nombre {
    if (this.min === -Infinity || this.max === Infinity)
      throw Error("Can't chose amongst infinity");
    let min =
      this.closure === ClosureType.OO || this.closure === ClosureType.OF
        ? this.min + EPSILON
        : this.min;
    let max =
      this.closure === ClosureType.OO || this.closure === ClosureType.FO
        ? this.max - EPSILON
        : this.max;
    const value = round(min + Math.random() * (max - this.min), precision);
    switch (this.type) {
      case NumberType.Integer:
        return new Integer(value);
      default:
        return new Real(value, value.toString());
    }
  }
  toTree() {
    const a =
      this.min === -Infinity ? MinusInfinityNode : new NumberNode(this.min);
    const b =
      this.max === Infinity ? PlusInfinityNode : new NumberNode(this.max);
    return new IntervalNode(a, b, this.closure);
  }
}
