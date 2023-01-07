import { Expression } from "../../expression/expression";
import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { Nombre } from "../nombre";

export class Integer implements Nombre {
  value: number;
  tex: string;

  constructor(value: number) {
    this.value = value;
    this.tex = value + "";
  }

  toTree(): Node {
    return new NumberNode(this.value);
  }
  // add(expression: Expression): Expression {

  // }
}
