import { Node, NodeType } from "../node";

export class NumberNode implements Node {
  tex: string;
  value: number;
  type: NodeType = NodeType.number;

  constructor(value: number) {
    this.value = value;
    this.tex = value + "";
  }

  toString(): string {
    return `${this.tex}`;
  }
}
