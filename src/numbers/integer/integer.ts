import { Expression } from "../../expression/expression";
import { Nombre } from "../nombre";

export class Integer implements Nombre {
  value: number;
  tex: string;
  constructor(value: number, tex: string) {
    this.value = value;
    this.tex = tex;
  }
  // add(expression: Expression): Expression {

  // }
}
