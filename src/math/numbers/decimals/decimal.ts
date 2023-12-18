import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { Integer } from "../integer/integer";
import { Nombre, NumberType } from "../nombre";

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

  static random(min: number, max: number, precision?: number): Decimal {
    let prec = precision ?? randint(1, 4);
    const int = randint(min, max) + "";
    const decimals = DecimalConstructor.randomFracPart(prec);
    return DecimalConstructor.fromParts(int, decimals);
  }
  static fromParts(intPart: string, decimalPart: string): Decimal {
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
  intPart: number;
  decimalPart: string;
  constructor(value: number) {
    this.value = value;
    this.tex = value + "";
    let [intPartString, decimalPartString] = (value + "").split(".");
    this.intPart = Number(intPartString);
    this.decimalPart = decimalPartString || "";
    this.precision = this.decimalPart.length;
  }

  /**
   *
   * @param precision 0 = unité, 1 = dixieme, ... , -1 : dizaine
   * @returns
   */
  round(precision: number): Nombre {
    const intPartString = this.intPart + "";

    if (precision < 0) {
      if (precision < -intPartString.length)
        throw Error("can't round to higher precision");
      return new Integer(this.intPart).round(-precision);
    }

    if (precision > this.precision)
      throw Error("can't round to higher precision");
    if (precision === this.precision) return this;

    let newFracPart = "",
      newIntPart = "";

    const shouldRoundUp = Number(this.decimalPart[precision]) > 4;

    if (shouldRoundUp) {
      let retenue = true;
      let i = precision - 1;
      while (retenue) {
        if (i > -1) {
          const nb = (Number(this.decimalPart[i]) + 1) % 10;
          if (nb || newFracPart) {
            newFracPart = nb.toString() + newFracPart;
          }
          if (nb !== 0) {
            retenue = false;
            for (let j = i - 1; j > -1; j--) {
              newFracPart = this.decimalPart[j] + newFracPart;
            }
            newIntPart = intPartString;
          } else i--;
        } else {
          const nb = (Number(intPartString[i + intPartString.length]) + 1) % 10;
          newIntPart = nb + "" + newIntPart;
          if (nb !== 0) {
            retenue = false;
            for (let j = i + intPartString.length - 1; j > -1; j--) {
              newIntPart = intPartString[j] + newIntPart;
            }
          } else i--;
        }
      }
    } else {
      let retenue = true;
      let i = precision - 1;
      while (retenue) {
        if (i > -1) {
          const nb = Number(this.decimalPart[i]);
          if (nb || newFracPart) {
            newFracPart = nb.toString() + newFracPart;
          }
          if (nb !== 0) {
            retenue = false;
            for (let j = i - 1; j > -1; j--) {
              newFracPart = this.decimalPart[j] + newFracPart;
            }
            newIntPart = intPartString;
          } else i--;
        } else {
          newIntPart = intPartString;
          retenue = false;
        }
      }
    }
    return DecimalConstructor.fromParts(newIntPart, newFracPart);
  }

  multiplyByPowerOfTen(power: number) {
    let newIntPart = "",
      newFracPart = "";

    if (power > -1) {
      newIntPart = this.intPart + "";
      for (let i = 0; i < power; i++) {
        newIntPart +=
          i > this.decimalPart.length - 1 ? "0" : this.decimalPart[i];
      }
      newFracPart = this.decimalPart.slice(power);
    } else {
      const intPartString = this.intPart + "";
      newFracPart = this.decimalPart;
      for (
        let i = intPartString.length - 1;
        i > intPartString.length - 1 + power;
        i--
      ) {
        newFracPart = (i < 0 ? "0" : intPartString[i]) + newFracPart;
      }
      if (power + intPartString.length < 1) newIntPart = "0";
      else newIntPart = intPartString.slice(0, power + intPartString.length);
    }
    return DecimalConstructor.fromParts(newIntPart, newFracPart);
  }

  toScientificPart(): Node {
    const intString = this.intPart.toString();
    const intSize = intString.length;
    if (intSize === 0 && this.intPart !== 0) return this.toTree();
    if (this.intPart === 0) {
      const firstNonZeroIndex = this.decimalPart
        .split("")
        .findIndex((el) => Number(el) !== 0);
      return new NumberNode(
        Number("0." + this.decimalPart.slice(firstNonZeroIndex)),
      );
    }
    return new NumberNode(
      Number(intString[0] + "." + intString.slice(1) + this.decimalPart),
    );
  }
  toScientificNotation(): Node {
    const intString = this.intPart.toString();
    const intSize = intString.length;
    if (intSize === 0) return this.toTree();
    const decNode = this.toScientificPart();
    let leadingZeros = 0;
    const nbs = this.decimalPart.split("").map(Number);
    for (let i = 0; i < nbs.length; i++) {
      if (nbs[i] !== 0) break;
      leadingZeros++;
    }
    const power = this.intPart === 0 ? -leadingZeros : intSize - 1;
    if (power === 1) return new MultiplyNode(decNode, new NumberNode(10));
    return new MultiplyNode(
      decNode,
      new PowerNode(new NumberNode(10), new NumberNode(power)),
    );
  }

  toTree(): Node {
    return new NumberNode(this.value);
  }
}
