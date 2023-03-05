import { randint } from '#root/math/utils/random/randint';
import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { Nombre, NumberType } from '../nombre';
import { Rational } from '../rationals/rational';

export abstract class IntegerConstructor {
  static random(nbOfDigits: number) {
    return randint(0, 10 ** nbOfDigits);
  }
}

export class Integer implements Nombre {
  value: number;
  tex: string;
  type: NumberType;

  constructor(value: number, tex?: string) {
    this.value = value;
    this.tex = tex || value + '';
    this.type = NumberType.Integer;
  }

  toTree(): Node {
    return new NumberNode(this.value, this.tex);
  }

  round(precision: number) {
    const intString = this.value + '';

    if (precision >= intString.length || precision < 1) throw Error("can't round to higher precision");

    let newInt = '';
    const shouldRoundUp = Number(intString[intString.length - precision]) > 4;
    if (shouldRoundUp) {
      for (let i = 0; i < precision; i++) {
        newInt += '0';
      }
      let retenue = true;
      let i = intString.length - precision - 1;

      while (retenue) {
        const nb = (Number(intString[i]) + 1) % 10;
        newInt = '' + nb + newInt;
        if (nb === 0) {
          i--;
        } else {
          retenue = false;
          for (let j = i - 1; j > -1; j--) {
            newInt = intString[j] + newInt;
          }
        }
      }
    } else {
      for (let i = 0; i < intString.length; i++) {
        newInt += i < intString.length - precision ? intString[i] : '0';
      }
    }
    return new Integer(Number(newInt));
  }
  divide(nb: Nombre): Nombre {
    switch (nb.type) {
      case NumberType.Integer:
        return new Rational(this.value, nb.value).simplify();
      case NumberType.Rational:
        const rational = nb as Rational;
        return new Rational(this.value * rational.denum, rational.num).simplify();
      default:
        throw Error('not implemented');
    }
  }
}
