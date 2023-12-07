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
  toAllValidTexs() {
    const res: string[] = [];
    res.push(this.tex);
    //!est-ce vraiment nécessaire sachant que les inputs students n'auront en théorie jamais de "."
    if (this.tex.includes(',')) res.push(this.tex.replace(',', '.'));
    return res;
  }
  toEquivalentNodes() {
    return [this];
  }
}
