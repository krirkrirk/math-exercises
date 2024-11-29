import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { AddNode, add } from "#root/tree/nodes/operators/addNode";
import { FractionNode, frac } from "#root/tree/nodes/operators/fractionNode";
import {
  MultiplyNode,
  multiply,
} from "#root/tree/nodes/operators/multiplyNode";
import {
  SubstractNode,
  substract,
} from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { doWhile } from "#root/utils/doWhile";
import { Rational } from "../numbers/rationals/rational";
import { randint } from "../utils/random/randint";

export class GeneralSystem {
  coeffs: AlgebraicNode[][];
  //coeffs[i][0]x+coeffs[i][1]y = coeffs[i][2]
  //ax+by = c
  //a2x = c2

  //x = c2/a2
  //a(c2/a2) +by = c
  //y = (c-a(c2/a2))/b

  //ax+by =c
  //dx+ey =f
  constructor(coeffs: AlgebraicNode[][]) {
    this.coeffs = coeffs;
  }
  solve() {
    if (this.coeffs.length !== 2)
      throw Error("General system resolution not implemented yet");

    const [a, b, c] = this.coeffs[0];
    const [d, e, f] = this.coeffs[1];
    const db = multiply(d, b);
    const ea = multiply(e, a);
    let x: AlgebraicNode;
    let y: AlgebraicNode;
    if (b.evaluate() === 0) {
      if (a.evaluate() === 0) throw Error("No solution");
      x = frac(c, a).simplify();
      if (e.evaluate() === 0) throw Error("No solution");
      y = frac(substract(f, multiply(d, x)), e).simplify();
    } else if (a.evaluate() === 0) {
      if (b.evaluate() === 0) throw Error("No solution");
      y = frac(c, b).simplify();
      if (d.evaluate() === 0) throw Error("No solution");
      x = frac(substract(f, multiply(e, y)), d).simplify();
    } else if (d.evaluate() === 0) {
      if (e.evaluate() === 0) throw Error("No solution");
      y = frac(f, e).simplify();
      if (a.evaluate() === 0) throw Error("No solution");
      x = frac(substract(c, multiply(b, y)), a).simplify();
    } else if (e.evaluate() === 0) {
      if (d.evaluate() === 0) throw Error("No solution");
      x = frac(f, d).simplify();
      if (b.evaluate() === 0) throw Error("No solution");
      y = frac(substract(c, multiply(a, x)), b).simplify();
    } else if (db.equals(ea)) throw Error("No solution");
    else {
      x = frac(
        substract(multiply(b, f), multiply(e, c)),
        substract(db, ea),
      ).simplify();
      y = frac(substract(c, multiply(a, x)), b).simplify();
    }

    return {
      x,
      y,
    };
  }
  toTex() {
    return `\\left\\{\\begin{matrix}
${add(
  multiply(this.coeffs[0][0], "x"),
  multiply(this.coeffs[0][1], "y"),
).toTex()}=${this.coeffs[0][2]} \\\\
${new AddNode(
  multiply(this.coeffs[1][0], "x"),
  multiply(this.coeffs[1][1], "y"),
).toTex()}=${this.coeffs[1][2]}
\\end{matrix}\\right.`;
  }
}
