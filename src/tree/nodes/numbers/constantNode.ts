import { Node, NodeType } from '../node';

export class ConstantNode implements Node {
  tex: string;
  mathString: string;
  type: NodeType = NodeType.constant;

  constructor(tex: string, mathString: string) {
    this.tex = tex;
    this.mathString = mathString;
  }

  toMathString(): string {
    return `${this.mathString}`;
  }
  toTex(): string {
    return `${this.tex}`;
  }
}
