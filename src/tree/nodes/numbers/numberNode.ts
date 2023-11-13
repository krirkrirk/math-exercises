import { parse } from 'mathjs';
import { Node, NodeType } from '../node';

export class NumberNode implements Node {
  tex: string;
  mathString: string;
  value: number;
  type: NodeType = NodeType.number;

  constructor(value: number, tex?: string, mathString?: string) {
    this.value = value;
    this.tex = tex || (value + '').replace('.', ',');
    this.mathString = mathString || this.value + '';
  }

  toMathString(): string {
    return `${this.mathString}`;
  }
  toTex(): string {
    return `${this.tex}`;
  }
  toMathjs() {
    return this.toMathString();
  }
  // simplify(): Node {
  //   return this;
  // }
}
