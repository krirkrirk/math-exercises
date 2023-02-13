import { Node, NodeType } from '../node';

export class ConstantNode implements Node {
  tex: string;
  approxValue: number;
  type: NodeType = NodeType.number;

  constructor(tex: string, approxValue: number) {
    this.approxValue = approxValue;
    this.tex = tex;
  }

  toMathString(): string {
    return `${this.tex}`;
  }
  toTex(): string {
    return `${this.tex}`;
  }
  // simplify(): Node {
  //   return this;
  // }
}
