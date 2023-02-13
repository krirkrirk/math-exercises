import { Node, NodeType } from '../node';
import { FunctionNode, FunctionsIds } from './functionNode';

export class CosNode extends FunctionNode implements Node {
  type: NodeType = NodeType.function;

  constructor(child: Node) {
    super(FunctionsIds.cos, child, '\\cos');
  }

  toMathString(): string {
    return `cos(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\cos\\left(${this.child.toTex()}\\right)`;
  }

  simplify(): Node {
    return this;
  }
}
