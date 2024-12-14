import { randomColor } from "#root/geogebra/colors";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { opposite } from "#root/tree/nodes/functions/oppositeNode";
import { add } from "#root/tree/nodes/operators/addNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { Trinom } from "./trinom";

export class GeneralAffine {
  a: AlgebraicNode;
  b: AlgebraicNode;
  variable: string;

  constructor(
    a: number | AlgebraicNode,
    b: number | AlgebraicNode,
    variable: string = "x",
  ) {
    if (typeof a === "number") this.a = a.toTree();
    else this.a = a;
    if (this.a.evaluate() === 0) throw new Error("Forbidden division by zero");
    if (typeof b === "number") this.b = b.toTree();
    else this.b = b;

    this.variable = variable;
  }

  getRoot(): AlgebraicNode {
    return frac(opposite(this.b), this.a).simplify();
  }

  toTree() {
    const monom = multiply(this.a, this.variable);
    if (this.b.evaluate() === 0) return monom;
    return add(monom, this.b);
  }
}
