// import { abs } from "mathjs";
import { Node, NodeIds, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
export function isAbsNode(a: Node): a is AbsNode {
  return isFunctionNode(a) && a.id === FunctionsIds.abs;
}
export class AbsNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.abs;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.abs,
      child: this.child.toIdentifiers(),
    };
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

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new AbsNode(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  simplify() {
    return new AbsNode(this.child.simplify());
  }

  evaluate(vars: Record<string, number>) {
    return Math.abs(this.child.evaluate(vars));
  }
  equals(node: AlgebraicNode) {
    return isAbsNode(node) && node.child.equals(this.child);
  }
}
