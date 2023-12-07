import { complex } from 'mathjs';
import { Node, NodeType } from '../node';
import { Complex } from '#root/math/complex/complex';
import { NumberNode } from '../numbers/numberNode';
import { VariableNode } from '../variables/variableNode';
import { OppositeNode } from '../functions/oppositeNode';
import { MultiplyNode } from '../operators/multiplyNode';
import { AddNode } from '../operators/addNode';

export class ComplexNode implements Node {
  tex: string;
  mathString: string;
  re: number;
  im: number;
  type: NodeType = NodeType.number;

  constructor(re: number, im: number, tex?: string, mathString?: string) {
    this.re = re;
    this.im = im;

    const reTex = re === 0 ? '' : re.toString();

    const imTex =
      im === 0
        ? ''
        : im === 1
        ? re === 0
          ? 'i'
          : '+i'
        : im === -1
        ? '-i'
        : im > 0
        ? re === 0
          ? `${im}i`
          : `+${im}i`
        : `${im}i`;
    const formatedTex = re === 0 && im === 0 ? '0' : `${reTex}${imTex}`;
    this.tex = tex || formatedTex;
    this.mathString = mathString || this.tex;
  }
  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    if (this.im === 0) {
      return [new NumberNode(this.re)];
    }
    if (this.re === 0) {
      if (this.im === 1) {
        return [new VariableNode('i')];
      }
      if (this.im === -1) {
        return [new OppositeNode(new VariableNode('i'))];
      }
      return new MultiplyNode(new NumberNode(this.im), new VariableNode('i')).toEquivalentNodes();
    }

    return new AddNode(
      new NumberNode(this.re),
      new MultiplyNode(new NumberNode(this.im), new VariableNode('i')),
    ).toEquivalentNodes();
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  toMathString(): string {
    return `${this.mathString ? this.mathString : this.tex}`;
  }
  toTex(): string {
    return `${this.tex}`;
  }
  toMathjs() {
    return complex(this.re, this.im);
  }
  toComplex() {
    return new Complex(this.re, this.im);
  }
}
