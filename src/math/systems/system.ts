import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { doWhile } from "#root/utils/doWhile";
import { Rational } from "../numbers/rationals/rational";
import { randint } from "../utils/random/randint";

export abstract class SystemConstructor {
  static random() {
    const a1 = randint(-10, 11, [0]);
    const b1 = randint(-10, 11, [0]);
    const c1 = randint(-10, 11);
    const a2 = randint(-10, 11, [0]);
    const b2 = doWhile(
      () => randint(-10, 11, [0]),
      (x) => a1 / b1 === a2 / x,
    );
    const c2 = randint(-10, 11);
    return new System([
      [a1, b1, c1],
      [a2, b2, c2],
    ]);
  }
  static niceValues() {
    const a1 = randint(-10, 11, [0]);
    const b1 = randint(-10, 11, [0]);
    const a2 = randint(-10, 11, [0]);
    const b2 = doWhile(
      () => randint(-10, 11, [0]),
      (x) => a1 / b1 === a2 / x,
    );
    const x = randint(-10, 11);
    const y = randint(-10, 11);
    const c1 = a1 * x + b1 * y;
    const c2 = a2 * x + b2 * y;
    return new System([
      [a1, b1, c1],
      [a2, b2, c2],
    ]);
  }
}
export class System {
  coeffs: number[][];
  //coeffs[i][0]x+coeffs[i][1]y = coeffs[i][2]
  constructor(coeffs: number[][]) {
    this.coeffs = coeffs;
  }
  solve() {
    if (this.coeffs.length !== 2)
      throw Error("General system resolution not implemented yet");

    const [a, b, c] = this.coeffs[0];
    const [d, e, f] = this.coeffs[1];
    if (!b || d * b === e * a) throw Error("No solution");
    const x = new FractionNode(
      (b * f - e * c).toTree(),
      (d * b - e * a).toTree(),
    ).simplify();
    const y = new FractionNode(
      new SubstractNode(c.toTree(), new MultiplyNode(a.toTree(), x)),
      b.toTree(),
    ).simplify();
    // const x = new FractionNode(
    //   new SubstractNode(
    //     this.coeffs[1][2].toTree(),
    //     new FractionNode(
    //       (this.coeffs[1][1] * this.coeffs[0][2]).toTree(),
    //       this.coeffs[0][1].toTree(),
    //     ).simplify(),
    //   ).simplify(),
    //   new SubstractNode(
    //     this.coeffs[1][0].toTree(),
    //     new FractionNode(
    //       (this.coeffs[1][1] * this.coeffs[0][0]).toTree(),
    //       this.coeffs[0][1].toTree(),
    //     ).simplify(),
    //   ).simplify(),
    // ).simplify();
    // //y = c-ax/b
    // const y = new FractionNode(
    //   new SubstractNode(
    //     this.coeffs[0][2].toTree(),
    //     new MultiplyNode(this.coeffs[0][0].toTree(), x).simplify(),
    //   ).simplify(),
    //   this.coeffs[0][1].toTree(),
    // ).simplify();
    return {
      x,
      y,
    };
  }
  toTex() {
    const x = new VariableNode("x");
    const y = new VariableNode("y");
    return `\\left\\{\\begin{matrix}
${new AddNode(
  new MultiplyNode(this.coeffs[0][0].toTree(), x),
  new MultiplyNode(this.coeffs[0][1].toTree(), y),
).toTex()}=${this.coeffs[0][2]} \\\\
${new AddNode(
  new MultiplyNode(this.coeffs[1][0].toTree(), x),
  new MultiplyNode(this.coeffs[1][1].toTree(), y),
).toTex()}=${this.coeffs[1][2]}
\\end{matrix}\\right.`;
  }
}
