// import { parse } from "mathjs";
import { Node, NodeType } from "../node";
import { AlgebraicNode } from "../algebraicNode";
export function isConstantNode(a: Node): a is ConstantNode {
  return a.type === NodeType.constant;
}
export class ConstantNode implements AlgebraicNode {
  tex: string;
  mathString: string;
  value: number;
  type: NodeType = NodeType.constant;
  isNumeric: boolean;
  constructor(tex: string, mathString: string, value: number) {
    this.tex = tex;
    this.mathString = mathString;
    this.value = value;
    this.isNumeric = true;
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
  toEquivalentNodes() {
    return [this];
  }
  evaluate(vars: Record<string, number>) {
    return this.value;
  }
  simplify() {
    return this;
  }
  equals(node: AlgebraicNode) {
    return isConstantNode(node) && node.tex === this.tex;
  }
}
