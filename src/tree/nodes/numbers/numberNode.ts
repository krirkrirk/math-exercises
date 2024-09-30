import { Node, NodeIds, NodeType } from "../node";
import { AlgebraicNode } from "../algebraicNode";
import { randint } from "#root/math/utils/random/randint";
export function isNumberNode(a: Node): a is NumberNode {
  return a.type === NodeType.number;
}

export abstract class NumberNodeConstructor {
  static random(min: number, max: number, excludes: number[] = []) {
    return new NumberNode(randint(min, max, excludes));
  }
}
export class NumberNode implements AlgebraicNode {
  tex: string;
  mathString: string;
  value: number;
  type: NodeType = NodeType.number;
  isNumeric: boolean;
  constructor(value: number, tex?: string, mathString?: string) {
    this.value = value;
    this.tex = tex?.replace(".", ",") || (value + "").replace(".", ",");
    this.mathString = mathString || this.value + "";
    this.isNumeric = true;
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
  toIdentifiers() {
    return {
      id: NodeIds.number,
      value: this.value,
    };
  }
  toAllValidTexs() {
    const res: string[] = [];
    res.push(this.tex);
    //!est-ce vraiment nécessaire sachant que les inputs students n'auront en théorie jamais de "."
    if (this.tex.includes(",")) res.push(this.tex.replace(",", "."));
    return res;
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
    return isNumberNode(node) && node.value === this.value;
  }
}
