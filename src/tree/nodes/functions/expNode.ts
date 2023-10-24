import { exp } from 'mathjs';
import { Node, NodeType } from '../node';
import { FunctionNode, FunctionsIds } from './functionNode';

export class ExpNode extends FunctionNode implements Node {
  type: NodeType = NodeType.function;

  constructor(child: Node) {
    super(FunctionsIds.exp, child, '\\exp');
  }

  toMathString(): string {
    return `e^(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    const needBraces = tex.length > 1;
    if (needBraces) return `e^{${this.child.toTex()}}`;
    return `e^${tex}`;
  }
  toMathjs() {
    return exp(this.child.toMathjs());
  }

  simplify(): Node {
    return this;
  }
}
