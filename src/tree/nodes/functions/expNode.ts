// import { exp } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
export function isExpNode(a: Node): a is ExpNode {
  return isFunctionNode(a) && a.id === FunctionsIds.exp;
}
export class ExpNode implements FunctionNode {
  opts?: NodeOptions;
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  constructor(child: AlgebraicNode, opts?: NodeOptions) {
    this.id = FunctionsIds.exp;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
    this.isNumeric = child.isNumeric;
  }

  toMathString(): string {
    return `e^(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    if (!this.opts?.allowPowerOne && tex === "1") {
      return "e";
    }
    if (this.opts?.useExpNotation) {
      return `\\exp\\left(${tex}\\right)`;
    }
    const needBraces = tex.length > 1;
    if (needBraces) return `e^{${tex}}`;
    return `e^${tex}`;
  }
  // toMathjs() {
  //   return exp(this.child.toMathjs());
  // }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new ExpNode(childNode));
      res.push(new ExpNode(childNode, { useExpNotation: true }));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  simplify() {
    return this;
  }
  evaluate(vars: Record<string, number>) {
    return Math.exp(this.child.evaluate(vars));
  }
  equals(node: AlgebraicNode) {
    return isExpNode(node) && node.child.equals(this.child);
  }
}
