import { randint } from "../../mathutils/random/randint";
import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { Nombre, NumberType } from "../nombre";

export abstract class DecimalConstructor {
  static random(min: number, max: number, precision: number) {
    const int = randint(min, max);
    let decimals = randint(0, Math.pow(10, precision));
    if (decimals % 10 === 0) decimals += randint(1, 10);
    return DecimalConstructor.fromParts(int, decimals);
  }
  static fromParts(intPart: number, decimalPart: number) {
    return new Decimal(Number("" + intPart + "." + decimalPart));
  }
}

export class Decimal implements Nombre {
  value: number;
  tex: string;
  type = NumberType.Decimal;
  precision: number;
  intPart: number;
  decimalPart: number;
  constructor(value: number) {
    this.value = value;
    this.tex = value + "";
    [this.intPart, this.decimalPart] = (value + "").split(".").map(Number);
    this.precision = (this.decimalPart + "").length;
  }
  atDecimalPosition(position: number): number {
    if (position > this.precision) throw Error("wrong position");
    return Number((this.decimalPart + "")[position]);
  }
  round(precision: number): Nombre {
    if (precision > this.precision) throw Error("can't round to higher precision");
    if (precision === this.precision) return this;
    const shouldRoundUp = Number((this.decimalPart + "")[precision + 1]) > 4;
    if (shouldRoundUp) {
      let retenue = true;
      let i = precision - 1;
      while (retenue) {}
    } else {
    }
  }

  toTree(): Node {
    return new NumberNode(this.value);
  }
}
