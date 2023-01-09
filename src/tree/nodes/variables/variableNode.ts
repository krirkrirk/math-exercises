import { Node, NodeType } from "../node";

export class VariableNode implements Node {
  tex: string;
  type = NodeType.variable;

  constructor(tex: string) {
    if (tex.length !== 1 || !tex.match("[a-zA-Z]")) throw Error("variable must be a letter");
    this.tex = tex;
  }

  toString(): string {
    return `${this.tex}`;
  }
}
