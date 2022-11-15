import { EPSILON } from "../../numbers/epsilon";
import { NumberType } from "../../numbers/number";
import { round } from "../../mathutils/round";
import { MathSetInterface } from "../mathSetInterface";
import { DiscreteSet } from "../discreteSet";
import { MathSet } from "../mathSet";

enum BoundType {
  OO = "]a;b[",
  OF = "]a;b]",
  FO = "[a;b[",
  FF = "[a;b]",
}

export class Interval implements MathSetInterface<Number> {
  min: number;
  max: number;
  boundType: BoundType;
  type: NumberType;
  tex: string;
  /**
   * [[a; b]] pour un interval d'integer;  [a;b] pour des réels
   */
  constructor(tex = "[-10; 10]") {
    this.tex = tex;
    const isInt = tex[1] === "[" || tex[1] === "]";
    this.type = isInt ? NumberType.Integer : NumberType.Real;
    const left = tex[0];
    const right = tex[tex.length - 1];
    const [a, b] = tex.slice(isInt ? 2 : 1, isInt ? tex.length - 2 : tex.length - 1).split(";");

    switch (`${left}a;b${right}`) {
      case "[a;b]":
        this.boundType = BoundType.FF;
        break;
      case "]a;b[":
        this.boundType = BoundType.OO;
        break;
      case "[a;b[":
        this.boundType = BoundType.FO;
        break;
      case "]a;b]":
        this.boundType = BoundType.OF;
        break;
      default:
        console.log(`${left}a;b${right}`);
        throw console.error("wrong interval");
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

  difference(set: DiscreteSet<number>) {
    const rand = () => {
      let x;
      do {
        x = this.getRandomElement();
      } while (set.includes(x));
      return x;
    };

    return new MathSet(this.toTex() + `\\ ${set.toTex()}`, rand);
  }

  toTex() {
    return;
  }
  getRandomElement(precision: number = this.type === NumberType.Integer ? 0 : 2): number {
    if (this.min === -Infinity || this.max === Infinity) throw Error("Can't chose amongst infinity");
    let min = this.boundType === BoundType.OO || this.boundType === BoundType.OF ? this.min + EPSILON : this.min;
    let max = this.boundType === BoundType.OO || this.boundType === BoundType.FO ? this.max - EPSILON : this.max;
    return round(min + Math.random() * (max - this.min), precision);
  }
}
