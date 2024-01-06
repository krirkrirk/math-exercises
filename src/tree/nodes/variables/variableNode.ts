import { AlgebraicNode } from "../algebraicNode";
import { Node, NodeType } from "../node";

export function isVariableNode(a: Node): a is VariableNode {
  return a.type === NodeType.variable;
}
export class VariableNode implements AlgebraicNode {
  name: string;
  type = NodeType.variable;
  isNumeric: boolean;
  constructor(name: string) {
    this.name = name;
    this.isNumeric = false;
  }

  toTex(): string {
    return `${this.name}`;
  }
  toMathString(): string {
    return `${this.name}`;
  }
  toMathjs() {
    return this.name;
  }
  toAllValidTexs() {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  toEquivalentNodes() {
    return [this];
  }

  evaluate(vars: Record<string, number>) {
    const value = vars[this.name];
    if (value === undefined)
      throw Error(`Can't evaluate variable ${this.name}`);
    return value;
  }
  // simplify(): Node {
  //   return this;
  // }
  simplify() {
    return this;
  }
  equals(node: AlgebraicNode) {
    return isVariableNode(node) && node.name === this.name;
  }
}
