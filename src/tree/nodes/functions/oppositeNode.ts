import { Node, NodeType } from '../node';
import { OperatorIds, OperatorNode } from '../operators/operatorNode';
import { FunctionNode, FunctionsIds } from './functionNode';

export class OppositeNode extends FunctionNode implements Node {
  constructor(child: Node) {
    super(FunctionsIds.opposite, child, '-');
  }
  toMathString(): string {
    return `-(${this.child.toMathString()})`;
  }
  toTex(): string {
    let childTex = this.child.toTex();
    let needBrackets = childTex[0] === '-';
    if (this.child.type === NodeType.operator) {
      const operatorChild = this.child as unknown as OperatorNode;
      needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(operatorChild.id);
    }
    if (needBrackets) childTex = `(${childTex})`;
    return `-${childTex}`;
  }
}
