import { Node, NodeType } from "../node";

export class NumberNode implements Node {
  tex: string;
  value: number;
  type: NodeType;
  id = "number";
  leftChild = null;
  rightChild = null;
  constructor(tex: string, value: number) {
    if (isNaN(+tex)) throw Error("not a number");

    this.value = value;
    this.tex = tex;
    this.type = NodeType.number;
  }
}
