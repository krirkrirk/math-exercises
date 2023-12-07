import { exp } from 'mathjs';
import { Node, NodeType } from '../node';
import { FunctionNode, FunctionsIds } from './functionNode';

type ExpNodeOptions = {
  useExpNotation: boolean;
};
export class ExpNode extends FunctionNode implements Node {
  opts?: ExpNodeOptions;
  type: NodeType = NodeType.function;

  constructor(child: Node, opts?: ExpNodeOptions) {
    super(FunctionsIds.exp, child, '\\exp');
    this.opts = opts;
  }

  toMathString(): string {
    return `e^(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    if (this.opts?.useExpNotation) {
      return `exp\\left(${this.child.toTex}\\right)`;
    }
    const needBraces = tex.length > 1;
    if (needBraces) return `e^{${this.child.toTex()}}`;
    return `e^${tex}`;
  }
  toMathjs() {
    return exp(this.child.toMathjs());
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new ExpNode(childNode));
      res.push(new ExpNode(childNode, { useExpNotation: true }));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  simplify(): Node {
    return this;
  }
}
