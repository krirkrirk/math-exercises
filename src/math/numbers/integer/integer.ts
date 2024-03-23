import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { random } from "#root/utils/random";
import { Nombre, NumberType } from "../nombre";
import { Rational } from "../rationals/rational";
import { primes } from "./primes";

export abstract class IntegerConstructor {
  static random(nbOfDigits: number, excludes?: number[]) {
    return randint(10 ** (nbOfDigits - 1), 10 ** nbOfDigits, excludes);
  }
  static randomPrime(max: number = 20) {
    return random(primes.filter((p) => p < 20));
  }
  static randomDifferents(
    min: number,
    max: number,
    nb: number,
    excludes?: number[],
  ) {
    const res: number[] = [];
    for (let i = 0; i < nb; i++) {
      let newNb: number;
      do {
        newNb = randint(min, max, excludes);
      } while (res.includes(newNb));
      res.push(newNb);
    }
    return res;
  }
}

export class Integer implements Nombre {
  value: number;
  tex: string;
  type: NumberType;

  constructor(value: number, tex?: string) {
    this.value = value;
    this.tex = tex || value + "";
    this.type = NumberType.Integer;
  }

  equals(n: Nombre) {
    return this.value === n.value;
  }
  toTree() {
    return new NumberNode(this.value, this.tex);
  }

  round(precision: number) {
    const intString = this.value + "";

    if (precision >= intString.length || precision < 1)
      throw Error("can't round to higher precision");

    let newInt = "";
    const shouldRoundUp = Number(intString[intString.length - precision]) > 4;
    if (shouldRoundUp) {
      for (let i = 0; i < precision; i++) {
        newInt += "0";
      }
      let retenue = true;
      let i = intString.length - precision - 1;

      while (retenue) {
        const nb = (Number(intString[i]) + 1) % 10;
        newInt = "" + nb + newInt;
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
        newInt += i < intString.length - precision ? intString[i] : "0";
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
        return new Rational(
          this.value * rational.denum,
          rational.num,
        ).simplify();
      default:
        throw Error("not implemented");
    }
  }
  multiply(nb: Nombre): Rational | Integer {
    switch (nb.type) {
      case NumberType.Integer:
        const int = nb as Integer;
        return new Integer(this.value * int.value);
      case NumberType.Rational:
        const rational = nb as Rational;
        return rational.multiply(this);
      default:
        throw Error("not implemented");
    }
  }
  opposite() {
    return new Integer(-this.value);
  }
  add(nb: Nombre) {
    switch (nb.type) {
      case NumberType.Integer:
        const int = nb as Integer;
        return new Integer(this.value + int.value);
      case NumberType.Rational:
        const rational = nb as Rational;
        return rational.add(this);
      default:
        throw Error("general integer add not implemented");
    }
  }
}
