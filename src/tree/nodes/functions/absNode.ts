// import { abs } from "mathjs";
import { Node, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
export function isAbsNode(a: Node): a is AbsNode {
  return isFunctionNode(a) && a.id === FunctionsIds.abs;
}
export class AbsNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.abs;
    this.child = child;
    this.type = NodeType.function;
  }

  toMathString(): string {
    return `abs(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\left|${this.child.toTex()}\\right|`;
  }
  // toMathjs() {
  //   return abs(this.child.toMathjs());
  // }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new AbsNode(childNode));
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
