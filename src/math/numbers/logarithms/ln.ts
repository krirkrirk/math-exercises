import { LogNode } from "#root/tree/nodes/functions/logNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { Nombre, NumberType } from "../nombre";

export class Ln implements Nombre {
  value: number;
  tex: string;
  type: NumberType;
  operand: Nombre;
  constructor(operand: Nombre) {
    this.type = NumberType.Real;
    this.value = Math.log(operand.value);
    this.tex = `\\ln(${operand})`;
    this.operand = operand;
  }
  toTree() {
    return new LogNode(this.operand.toTree());
  }
  simplify() {}
}
