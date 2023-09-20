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
    return `e^{${this.child.toTex()}}`;
  }
  toMathjs() {
    return exp(this.child.toMathjs());
  }

  simplify(): Node {
    return this;
  }
}
