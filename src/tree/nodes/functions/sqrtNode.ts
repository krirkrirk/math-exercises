import { sqrt } from 'mathjs';
import { Node, NodeType } from '../node';
import { FunctionNode, FunctionsIds } from './functionNode';

export class SqrtNode extends FunctionNode implements Node {
  type: NodeType = NodeType.function;
  constructor(child: Node) {
    super(FunctionsIds.sqrt, child, '\\sqrt');
  }
  toMathString(): string {
    return `sqr(${this.child.toMathString()})`;
  }
  toMathjs() {
    return sqrt(this.child.toMathjs());
  }
  toTex(): string {
    return `\\sqrt{${this.child.toTex()}}`;
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new SqrtNode(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
}
