import { randomColor } from "#root/geogebra/colors";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { opposite } from "#root/tree/nodes/functions/oppositeNode";
import { NodeIds } from "#root/tree/nodes/node";
import {
  NodeConstructor,
  NodeIdentifiers,
  reifyAlgebraic,
} from "#root/tree/nodes/nodeConstructor";
import { add } from "#root/tree/nodes/operators/addNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { substract } from "#root/tree/nodes/operators/substractNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { Trinom } from "./trinom";

export abstract class GeneralAffineConstructor {
  static fromIdentifiers(identifiers: GeneralAffineIdentifiers) {
    return new GeneralAffine(
      reifyAlgebraic(identifiers.a),
      reifyAlgebraic(identifiers.b),
    );
  }
}
export type GeneralAffineIdentifiers = {
  id: "affine";
  a: NodeIdentifiers;
  b: NodeIdentifiers;
  variable?: string;
};
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
  toIdentifiers(): GeneralAffineIdentifiers {
    return {
      id: "affine",
      a: this.a.toIdentifiers(),
      b: this.b.toIdentifiers(),
      variable: this.variable !== "x" ? this.variable : undefined,
    };
  }
  getRoot(): AlgebraicNode {
    return frac(opposite(this.b), this.a).simplify();
  }

  toTree() {
    const monom = multiply(this.a, this.variable);
    if (this.b.evaluate() === 0) return monom;
    return add(monom, this.b);
  }

  xIntersect(aff: GeneralAffine) {
    if (aff.a.evaluate() === this.a.evaluate()) return undefined;
    return frac(substract(aff.b, this.b), substract(this.a, aff.a)).simplify();
  }
  opposite() {
    return new GeneralAffine(opposite(this.a), opposite(this.b));
  }
}
