// import { exp } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
import { isNumberNode } from "../numbers/numberNode";
import { isLogNode } from "./logNode";
import { multiply } from "../operators/multiplyNode";

export const exp = (a: AlgebraicNode | number | string) => {
  const nodeA =
    typeof a === "number" ? a.toTree() : typeof a === "string" ? a.toTree() : a;
  return new ExpNode(nodeA);
};

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
  toIdentifiers() {
    return {
      id: NodeIds.exp,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `e^(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    if (!this.opts?.allowPowerOne && tex === "1") {
      return "e";
    }
    if (tex === "0") {
      return "1";
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

  simplify(): AlgebraicNode {
    const simplifiedChild = this.child.simplify();
    if (isNumberNode(simplifiedChild) && simplifiedChild.value === 0)
      return (1).toTree();
    if (isLogNode(simplifiedChild)) return simplifiedChild.child;
    return new ExpNode(simplifiedChild);
  }
  evaluate(vars?: Record<string, number>) {
    return Math.exp(this.child.evaluate(vars));
  }
  equals(node: AlgebraicNode): boolean {
    return isExpNode(node) && node.child.equals(this.child);
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return new ExpNode(this.child.toDetailedEvaluation(vars));
  }
  derivative(varName?: string | undefined) {
    return multiply(this.child.derivative(varName), this);
  }
}
