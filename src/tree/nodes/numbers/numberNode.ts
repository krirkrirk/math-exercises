import { Node, NodeType } from '../node';

export class NumberNode implements Node {
  tex: string;
  value: number;
  type: NodeType = NodeType.number;

  constructor(value: number, tex?: string) {
    this.value = value;
    this.tex = tex || value + '';
  }

  toMathString(): string {
    return `${this.tex}`;
  }
  toTex(): string {
    return `${this.tex}`;
  }
}
