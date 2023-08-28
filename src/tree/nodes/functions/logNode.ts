import { Node, NodeType } from '../node';
import { FunctionNode, FunctionsIds } from './functionNode';

export class LogNode extends FunctionNode implements Node {
  type: NodeType = NodeType.function;

  constructor(child: Node) {
    super(FunctionsIds.log, child, '\\ln');
  }

  toMathString(): string {
    return `log(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\ln\\left(${this.child.toTex()}\\right)`;
  }

  simplify(): Node {
    return this;
  }
}
