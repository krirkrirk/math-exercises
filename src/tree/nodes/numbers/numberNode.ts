import { Node, NodeType } from "../node";

export class NumberNode implements Node {
  tex: string;
  value: number;
  type: NodeType;
  id = "number";
  leftChild = null;
  rightChild = null;
  constructor(value: number) {
    this.value = value;
    this.tex = value + "";
    this.type = NodeType.number;
  }

  toString(): string {
    return `${this.tex}`;
  }
}
