import { Node, NodeIds, NodeType } from "../node";
import { AlgebraicNode } from "../algebraicNode";

export function isDegreeNode(a: Node): a is DegreeNode {
  return a.type === NodeType.number;
}

export class DegreeNode implements AlgebraicNode {
  tex: string;
  mathString: string;
  value: number;
  type: NodeType = NodeType.number;
  isNumeric: boolean;
  constructor(value: number, tex?: string, mathString?: string) {
    this.value = value;
    this.tex =
      (tex?.replace(".", ",") || (value + "").replace(".", ",")) + `^{\\circ}`;
    this.mathString = mathString || this.value + "^\\{\\circ\\}";
    this.isNumeric = true;
  }
  toIdentifiers() {
    return {
      id: NodeIds.degree,
      value: this.value,
    };
  }
  toMathString(): string {
    return `${this.mathString}`;
  }
  toTex(): string {
    return `${this.tex}`;
  }
  toMathjs() {
    return this.toMathString();
  }
  toAllValidTexs() {
    const res: string[] = [];
    res.push(this.tex);
    res.push(this.value.frenchify());
    //!est-ce vraiment nécessaire sachant que les inputs students n'auront en théorie jamais de "."
    if (this.tex.includes(",")) res.push(this.tex.replace(",", "."));
    return res;
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
    return isDegreeNode(node) && node.value === this.value;
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return this;
  }
  derivative(varName?: string | undefined): AlgebraicNode {
    throw new Error("unimplemented derivative");
  }
}
