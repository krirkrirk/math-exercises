import { Node, NodeType } from '../node';

export class NumberNode implements Node {
  tex: string;
  mathString: string;
  value: number;
  type: NodeType = NodeType.number;

  constructor(value: number, tex?: string, mathString?: string) {
    this.value = value;
    this.tex = tex || value + '';
    this.mathString = mathString || this.tex;
  }

  toMathString(): string {
    return `${this.mathString ? this.mathString : this.tex}`;
  }
  toTex(): string {
    return `${this.tex}`;
  }
  // simplify(): Node {
  //   return this;
  // }
}
