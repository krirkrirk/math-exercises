import { sin } from "mathjs";
import { Node, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
export function isSinNode(a: Node): a is SinNode {
  return isFunctionNode(a) && a.id === FunctionsIds.sin;
}
export class SinNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.opposite;
    this.child = child;
    this.type = NodeType.function;
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
