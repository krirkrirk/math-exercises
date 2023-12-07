import { log } from 'mathjs';
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
  toMathjs() {
    return log(this.child.toMathjs());
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new LogNode(childNode));
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
