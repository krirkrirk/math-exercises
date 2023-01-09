import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { PowerNode } from "../../tree/nodes/operators/powerNode";
import { Nombre, NumberType } from "../nombre";

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
  simplify(): Node {
    if (this.power === 0) return new NumberNode(1);
    if (this.power === 1) return new NumberNode(this.operand);
    if (this.operand === 1) return new NumberNode(1);
    if (this.operand === 0) return new NumberNode(0);
    if (this.operand === -1) return new NumberNode(this.power % 2 === 0 ? 1 : -1);
    return this.toTree();
  }
  toTree(): Node {
    return new PowerNode(new NumberNode(this.operand), new NumberNode(this.power));
  }
}
