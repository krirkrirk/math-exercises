import { cos } from 'mathjs';
import { Node, NodeType } from '../node';
import { FunctionNode, FunctionsIds } from './functionNode';

export class CosNode implements FunctionNode {
  id: FunctionsIds;
  child: Node;
  type: NodeType;

  constructor(child: Node) {
    this.id = FunctionsIds.opposite;
    this.child = child;
    this.type = NodeType.function;
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
