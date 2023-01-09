import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { Nombre, NumberType } from "../nombre";
import { Rational } from "../rationals/rational";

export class Integer implements Nombre {
  value: number;
  tex: string;
  type: NumberType;

  constructor(value: number) {
    this.value = value;
    this.tex = value + "";
    this.type = NumberType.Integer;
  }

  toTree(): Node {
    return new NumberNode(this.value);
  }

  divide(nb: Nombre): Nombre {
    switch (nb.type) {
      case NumberType.Integer:
        return new Rational(this.value, nb.value).simplify();
      case NumberType.Rational:
        const rational = nb as Rational;
        return new Rational(this.value * rational.denum, rational.num).simplify();
      default:
        throw Error("not implemented");
    }
  }
}
