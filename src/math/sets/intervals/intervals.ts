import { EPSILON } from "#root/math/numbers/epsilon";
import { Integer } from "#root/math/numbers/integer/integer";
import { Nombre, NumberType } from "#root/math/numbers/nombre";
import { Real } from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { Closure, ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/coinFlip";
import { diceFlip } from "#root/utils/diceFlip";
import { DiscreteSet } from "../discreteSet";
import { MathSet } from "../mathSet";
import { MathSetInterface } from "../mathSetInterface";

export abstract class IntervalConstructor {
  static random() {
    const randType = randint(0, 6);
    let a: number, b: number;
    let min: AlgebraicNode, max: AlgebraicNode, closure: ClosureType;
    switch (randType) {
      case 0:
        min = MinusInfinityNode;
        max = randint(-10, 10).toTree();
        closure = coinFlip() ? ClosureType.OF : ClosureType.OO;
        break;
      case 1:
        min = randint(-10, 10).toTree();
        max = PlusInfinityNode;
        closure = coinFlip() ? ClosureType.OO : ClosureType.FO;
        break;
      case 2:
        a = randint(-10, 10);
        min = a.toTree();
        max = randint(a + 1, a + 10).toTree();
        closure = ClosureType.FF;
        break;
      case 3:
        a = randint(-10, 10);
        min = a.toTree();
        max = randint(a + 1, a + 10).toTree();
        closure = ClosureType.OF;
        break;
      case 4:
        a = randint(-10, 10);
        min = a.toTree();
        max = randint(a + 1, a + 10).toTree();
        closure = ClosureType.FO;
        break;
      case 5:
      default:
        a = randint(-10, 10);
        min = a.toTree();
        max = randint(a + 1, a + 10).toTree();
        closure = ClosureType.OO;
        break;
    }
    return new Interval(min, max, closure);
  }
  static differentRandoms(nb: number) {
    const res: Interval[] = [];
    for (let i = 0; i < nb; i++) {
      let interval: Interval;
      do {
        interval = this.random();
      } while (res.some((int) => int.equals(interval)));
      res.push(this.random());
    }
    return res;
  }
}

export class Interval implements MathSetInterface {
  minNode: AlgebraicNode;
  min: number;
  minTex: string;
  max: number;
  maxNode: AlgebraicNode;
  maxTex: string;
  closure: ClosureType;
  leftBracket: "[" | "]";
  rightBracket: "[" | "]";
  leftInequalitySymbol: "\\le" | "<";
  rightInequalitySymbol: "\\le" | "<";
  tex: string;
  constructor(min: AlgebraicNode, max: AlgebraicNode, closure: ClosureType) {
    this.closure = closure;
    this.minNode = min;
    this.maxNode = max;
    this.min = min.evaluate({});
    this.max = max.evaluate({});
    this.minTex = min.toTex();
    this.maxTex = max.toTex();
    this.leftBracket =
      closure === ClosureType.FF || closure === ClosureType.FO ? "[" : "]";
    this.rightBracket =
      closure === ClosureType.FF || closure === ClosureType.OF ? "]" : "[";
    this.leftInequalitySymbol = this.leftBracket === "[" ? "\\le" : "<";
    this.rightInequalitySymbol = this.rightBracket === "]" ? "\\le" : "<";
    this.tex = this.toTex();
  }

  equals(interval: Interval) {
    return (
      this.min === interval.min &&
      this.max === interval.max &&
      this.closure === interval.closure
    );
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
    let min = this.min < interval.min ? this.minNode : interval.minNode;
    let max = this.max > interval.max ? this.maxNode : interval.maxNode;

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
        `${unionLeftBracket}\\ ${firstInterval.minTex};${firstInterval.maxTex}\\ ${firstInterval.rightBracket}\\ \\cup\\ ${secondInterval.leftBracket}\\ ${secondInterval.minTex};${secondInterval.maxTex}\\ ${unionRightBracket}\\ `,
        () =>
          coinFlip()
            ? firstInterval.getRandomElement()
            : secondInterval.getRandomElement(),
      );
    } else {
      const closure = Closure.fromBrackets(unionLeftBracket, unionRightBracket);
      return new Interval(min, max, closure);
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
      return new MathSet("\\varnothing", () => null);
    }
    const winningLeftBracket = (brack1: "]" | "[", brack2: "]" | "[") =>
      brack1 === "]" || brack2 === "]" ? "]" : "[";
    const winningRightBracket = (brack1: "]" | "[", brack2: "]" | "[") =>
      brack1 === "[" || brack2 === "[" ? "[" : "]";
    let min = a >= c ? this.minNode : interval.minNode;
    let leftBracket =
      a === c
        ? winningLeftBracket(this.leftBracket, interval.leftBracket)
        : a > c
        ? this.leftBracket
        : interval.leftBracket;

    const max = b <= d ? this.maxNode : interval.maxNode;

    let rightBracket =
      b === d
        ? winningRightBracket(this.rightBracket, interval.rightBracket)
        : b < d
        ? this.rightBracket
        : interval.rightBracket;

    const closure = Closure.fromBrackets(leftBracket, rightBracket);
    return new Interval(min, max, closure);
  }

  insideToTex(): string {
    return `${this.minTex};${this.maxTex}`;
  }
  toTex(): string {
    return `${this.leftBracket}\\ ${this.insideToTex()}\\ ${
      this.rightBracket
    }\\ `;
  }

  toInequality(): string {
    const isLeftClosed =
      this.closure === ClosureType.FO || this.closure === ClosureType.FF;
    const isRightClosed =
      this.closure === ClosureType.FF || this.closure === ClosureType.OF;
    if (this.max === Infinity) {
      if (isLeftClosed) {
        return `x\\ge${this.minTex}`;
      } else return `x>${this.minTex}`;
    } else if (this.min === -Infinity) {
      if (this.closure === ClosureType.OF) {
        return `x\\le${this.maxTex}`;
      } else return `x<${this.maxTex}`;
    }
    return `${this.minTex}${isLeftClosed ? "\\le x" : "<x"}${
      isRightClosed ? "\\le" : "<"
    }${this.maxTex}`;
  }

  getRandomElement(): Nombre {
    throw Error("not implemented");
  }

  toTree() {
    return new IntervalNode(this.minNode, this.maxNode, this.closure);
  }
}
