// import { parse } from "mathjs";
import { Node, NodeIds, NodeType } from "../node";
import { AlgebraicNode } from "../algebraicNode";

export function isInfiniteNode(a: Node): a is ConstantNode {
  return (
    a.type === NodeType.constant && (a as ConstantNode).tex.includes("infty")
  );
}

export function isConstantNode(a: Node): a is ConstantNode {
  return a.type === NodeType.constant;
}
export class ConstantNode implements AlgebraicNode {
  tex: string;
  mathString: string;
  value: number;
  type: NodeType;
  isNumeric: boolean;
  constructor(tex: string, mathString: string, value: number) {
    this.tex = tex;
    this.mathString = mathString;
    this.value = value;
    this.isNumeric = true;
    this.type = NodeType.constant;
  }

  toMathString(): string {
    return `${this.mathString}`;
  }
  toTex(): string {
    return `${this.tex}`;
  }
  // toMathjs() {
  //   return parse(this.mathString);
  // }
  toAllValidTexs() {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  toIdentifiers() {
    return {
      id: NodeIds.constant,
      mathString: this.mathString,
      tex: this.tex,
      value: this.value,
    };
  }
  toEquivalentNodes() {
    return [this];
  }
  evaluate(vars?: Record<string, number>) {
    return this.value;
  }
  simplify() {
    return this;
  }
  equals(node: AlgebraicNode) {
    return isConstantNode(node) && node.tex === this.tex;
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return this;
  }
  derivative(varName?: string | undefined) {
    if (isInfiniteNode(this)) throw Error("Can't derivate infinite node");
    return (0).toTree() as AlgebraicNode;
  }
}
