import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { Nombre } from "../nombre";

export class Real implements Nombre {
  value: number;
  tex: string;
  constructor(value: number, tex: string) {
    this.value = value;
    this.tex = tex;
  }
  toTree(): Node {
    return new NumberNode(this.value);
  }
}
