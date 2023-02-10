import { Node, NodeType } from '../node';
import { FunctionNode, FunctionsIds } from './functionNode';

export class SqrtNode extends FunctionNode implements Node {
  type: NodeType = NodeType.function;
  constructor(child: Node) {
    super(FunctionsIds.sqrt, child, '\\sqrt');
  }
  toMathString(): string {
    return `sqrt(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\sqrt{${this.child.toTex()}}`;
  }
}
