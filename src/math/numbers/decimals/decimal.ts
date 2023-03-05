import { randint } from '#root/math/utils/random/randint';
import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { Integer } from '../integer/integer';
import { Nombre, NumberType } from '../nombre';

export abstract class DecimalConstructor {
  static randomFracPart(precision: number): string {
    let decimals = '';
    for (let i = 0; i < precision; i++) {
      decimals += randint(i === precision - 1 ? 1 : 0, 10);
    }
    return decimals;
  }

  static random(min: number, max: number, precision: number): Decimal {
    const int = randint(min, max) + '';
    const decimals = DecimalConstructor.randomFracPart(precision);
    return DecimalConstructor.fromParts(int, decimals);
  }
  static fromParts(intPart: string, decimalPart: string): Decimal {
    return new Decimal(Number('' + intPart + '.' + decimalPart));
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
    this.tex = value + '';
    let [intPartString, decimalPartString] = (value + '').split('.');
    this.intPart = Number(intPartString);
    this.decimalPart = decimalPartString || '';
    this.precision = this.decimalPart.length;
  }

  /**
   *
   * @param precision 0 = unité, 1 = dixieme, ... , -1 : dizaine
   * @returns
   */
  round(precision: number): Nombre {
    const intPartString = this.intPart + '';

    if (precision < 0) {
      if (precision < -intPartString.length) throw Error("can't round to higher precision");
      return new Integer(this.intPart).round(-precision);
    }

    if (precision > this.precision) throw Error("can't round to higher precision");
    if (precision === this.precision) return this;

    let newFracPart = '',
      newIntPart = '';

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
          newIntPart = nb + '' + newIntPart;
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
    let newIntPart = '',
      newFracPart = '';

    if (power > -1) {
      newIntPart = this.intPart + '';
      for (let i = 0; i < power; i++) {
        newIntPart += i > this.decimalPart.length - 1 ? '0' : this.decimalPart[i];
      }
      newFracPart = this.decimalPart.slice(power);
    } else {
      const intPartString = this.intPart + '';
      newFracPart = this.decimalPart;
      for (let i = intPartString.length - 1; i > intPartString.length - 1 + power; i--) {
        newFracPart = (i < 0 ? '0' : intPartString[i]) + newFracPart;
      }
      if (power + intPartString.length < 1) newIntPart = '0';
      else newIntPart = intPartString.slice(0, power + intPartString.length);
    }
    return DecimalConstructor.fromParts(newIntPart, newFracPart);
  }

  toTree(): Node {
    return new NumberNode(this.value);
  }
}
