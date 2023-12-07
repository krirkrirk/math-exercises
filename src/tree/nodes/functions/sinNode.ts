import { sin } from 'mathjs';
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
  toMathjs() {
    return sin(this.child.toMathjs());
  }
  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new SinNode(childNode));
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
