import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { Nombre, NumberType } from "../nombre";
import { Integer } from "./integer";

export class Power implements Nombre {
  value: number;
  tex: string;
  type: NumberType;
  operand: number;
  power: number;
  constructor(a: number, b: number) {
    this.operand = a;
    this.power = b;
    this.value = Math.pow(a, b);
    this.tex = `${a}^{${b}}`;
    this.type = b < 0 ? NumberType.Rational : NumberType.Integer;
  }
  equals(n: Nombre) {
    return this.value === n.value;
  }
  simplify() {
    if (this.power === 0) return new NumberNode(1);
    if (this.power === 1) return new NumberNode(this.operand);
    if (this.operand === 1) return new NumberNode(1);
    if (this.operand === 0) return new NumberNode(0);
    if (this.operand === -1)
      return new NumberNode(this.power % 2 === 0 ? 1 : -1);
    return this.toTree();
  }
  toDecimalWriting(): Nombre {
    if (this.operand !== 10)
      throw Error("only implemented for powers of ten so far");
    let s = "";
    if (this.power > -1) {
      s += "1";
      for (let i = 0; i < this.power; i++) {
        s += 0;
      }
    } else {
      s += "1";
      for (let i = 1; i < Math.abs(this.power); i++) {
        s = "0" + s;
      }
      s = "0." + s;
    }

    return new Integer(Number(s), s);
  }
  toTree() {
    return new PowerNode(
      new NumberNode(this.operand),
      new NumberNode(this.power),
    );
  }
}
