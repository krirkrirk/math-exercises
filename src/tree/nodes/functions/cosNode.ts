import { cos } from 'mathjs';
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

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new CosNode(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(): string {
    return `\\cos\\left(${this.child.toTex()}\\right)`;
  }

  toMathjs() {
    return cos(this.child.toMathjs());
  }

  simplify(): Node {
    return this;
  }
}
