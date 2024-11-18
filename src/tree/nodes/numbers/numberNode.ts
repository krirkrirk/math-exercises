import { Node, NodeIds, NodeOptions, NodeType, ToTexOptions } from "../node";
import { AlgebraicNode } from "../algebraicNode";
import { randint } from "#root/math/utils/random/randint";
import { colorize } from "#root/utils/latex/colorize";
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
  opts?: NodeOptions;
  constructor(
    value: number,
    tex?: string,
    mathString?: string,
    opts?: NodeOptions,
  ) {
    this.value = value;
    this.tex = tex?.replace(".", ",") || (value + "").replace(".", ",");
    this.mathString = mathString || this.value + "";
    this.isNumeric = true;
    this.opts = opts;
  }

  toMathString(): string {
    return `${this.mathString}`;
  }
  toTex(options?: ToTexOptions): string {
    const opts = this.opts?.toTexOptions ?? options;
    const color = opts?.color;
    return colorize(`${this.tex}`, color);
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
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return this;
  }
}
