import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PercentNode } from "#root/tree/nodes/numbers/percentNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { Nombre, NumberType } from "../nombre";
import { Rational } from "../rationals/rational";

export abstract class DecimalConstructor {
  static randomFracPart(precision: number, leadingZeros: number = 0): string {
    let decimals = "";
    for (let i = 0; i < precision; i++) {
      if (i < leadingZeros) decimals += "0";
      if (i === precision - 1 || (i === 0 && !leadingZeros))
        decimals += randint(1, 10);
      else decimals += randint(0, 10);
    }
    return decimals;
  }

  //! a refacto, pour inclure "-0" et des min/max décimaux
  static random(min: number, max: number, precision?: number): Decimal {
    let prec = precision ?? randint(1, 4);
    const int = randint(min, max) + "";
    const decimals = DecimalConstructor.randomFracPart(prec);
    return DecimalConstructor.fromParts(int, decimals);
  }
  static fromParts(intPart: string, decimalPart: string): Decimal {
    if (decimalPart.length === 0) return new Decimal(Number("" + intPart));
    return new Decimal(Number("" + intPart + "." + decimalPart));
  }
  //returns X.YYYY where X € [0, 9] and first Y is not zero if X is zero
  static randomScientific(precision?: number): Decimal {
    let prec = precision ?? randint(1, 4);
    const int = randint(0, 10) + "";
    const decimals = DecimalConstructor.randomFracPart(prec, 0);
    return DecimalConstructor.fromParts(int, decimals);
  }
}

export class Decimal implements Nombre {
  value: number;
  tex: string;
  type = NumberType.Decimal;
  precision: number;
  intPart: number; // can be -0
  decimalPart: string;
  constructor(value: number) {
    this.value = value;
    this.tex = value + "";
    let [intPartString, decimalPartString] = (value + "").split(".");
    this.intPart = Number(intPartString);
    this.decimalPart = decimalPartString || "";
    this.precision = this.decimalPart.length;
  }

  equals(n: Nombre) {
    return this.value === n.value;
  }

  /**
   *
   * @param precision 0 = unité, 1 = dixieme, ... , -1 : dizaine
   * @returns
   */
  round(precision: number): Nombre {
    return new Decimal(round(this.value, precision));
  }

  multiplyByPowerOfTen(power: number) {
    if (power === 0) return this;
    let newIntPart = "",
      newFracPart = "";

    if (power > 0) {
      newIntPart = (this.value + "").split(".")[0];
      for (let i = 0; i < power; i++) {
        newIntPart +=
          i > this.decimalPart.length - 1 ? "0" : this.decimalPart[i];
      }
      newFracPart = this.decimalPart.slice(power);
    } else {
      const intPartString = this.intPart.toString().replace("-", "");
      const isNegative = this.value < 0;
      newFracPart = this.decimalPart;
      for (
        let i = intPartString.length - 1;
        i > intPartString.length - 1 + power;
        i--
      ) {
        newFracPart = (i < 0 ? "0" : intPartString[i]) + newFracPart;
      }
      if (power + intPartString.length < 1)
        newIntPart = isNegative ? "-0" : "0";
      else
        newIntPart =
          (isNegative ? "-" : "") +
          intPartString.slice(0, power + intPartString.length);
    }
    console.log("in", newIntPart, newFracPart);
    return DecimalConstructor.fromParts(newIntPart, newFracPart);
  }

  toScientificPart() {
    if (!this.decimalPart.length) return this.intPart;
    // const intString = this.intPart.toString();
    // const intSize = intString.length;
    // if (intSize === 0 && this.intPart !== 0) return this.toTree();
    if (this.intPart === 0) {
      //true for -0
      const firstNonZeroIndex = this.decimalPart
        .split("")
        .findIndex((el) => Number(el) !== 0);
      return Number(
        (this.tex[0] === "-"
          ? `-${this.decimalPart[firstNonZeroIndex]}.`
          : `${this.decimalPart[firstNonZeroIndex]}.`) +
          this.decimalPart.slice(firstNonZeroIndex + 1),
      );
    }
    const intString = this.intPart + "";
    return Number(
      (this.tex[0] === "-" ? "-" + this.tex[1] : this.tex[0]) +
        "." +
        (this.tex[0] === "-" ? intString.slice(2) : intString.slice(1)) +
        this.decimalPart,
    );
  }
  toScientificNotation(decimals?: number) {
    const intString = this.intPart + "";
    // const intSize = intString.length + (this.value < 0 ? 1 : 0);
    if (this.intPart > -10 && this.intPart < 10 && this.intPart !== 0)
      return this.toTree();
    const decNode = new NumberNode(
      decimals !== undefined
        ? round(this.toScientificPart(), decimals)
        : this.toScientificPart(),
    );
    let leadingZeros = 0;
    const nbs = this.decimalPart.split("").map(Number);
    for (let i = 0; i < nbs.length; i++) {
      if (nbs[i] !== 0) break;
      leadingZeros++;
    }
    const power =
      this.intPart === 0 ? -(leadingZeros + 1) : (this.intPart + "").length - 1;
    if (power === 0) return this.toTree();
    if (power === 1) return new MultiplyNode(decNode, new NumberNode(10));
    return new MultiplyNode(
      decNode,
      new PowerNode(new NumberNode(10), new NumberNode(power)),
    );
  }

  toRational() {
    return new Rational(
      this.multiplyByPowerOfTen(this.precision).value,
      10 ** this.precision,
    ).simplify();
  }
  toTree() {
    return new NumberNode(this.value);
  }

  toPercentNode() {
    return new PercentNode(this.multiplyByPowerOfTen(2).value);
  }
}
