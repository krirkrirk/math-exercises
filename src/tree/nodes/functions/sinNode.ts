import { Node, NodeType } from '../node';
import { FunctionNode, FunctionsIds } from './functionNode';

export class SinNode extends FunctionNode implements Node {
  type: NodeType = NodeType.function;

  constructor(child: Node) {
    super(FunctionsIds.sin, child, '\\sin');
  }

  toMathString(): string {
    return `sin(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\sin\\left(${this.child.toTex()}\\right)`;
  }

  simplify(): Node {
    return this;
  }
}
