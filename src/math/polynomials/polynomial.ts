import { Node, NodeOptions } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { AddNode } from "../../tree/nodes/operators/addNode";
import { MultiplyNode } from "../../tree/nodes/operators/multiplyNode";
import { OppositeNode } from "../../tree/nodes/functions/oppositeNode";
import { PowerNode } from "../../tree/nodes/operators/powerNode";
import { SubstractNode } from "../../tree/nodes/operators/substractNode";
import { VariableNode } from "../../tree/nodes/variables/variableNode";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { Rational } from "../numbers/rationals/rational";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";

export abstract class PolynomialConstructor {
  static randomWithOrder(order: number, variable: string = "x") {
    if (order < 0) {
      throw Error("Order must be a non-negative integer");
    }

    const coefficients = [];
    for (let i = 0; i <= order - 1; i++) {
      coefficients.push(randint(-9, 10));
    }
    coefficients.push(randint(-9, 10, [0]));

    return new Polynomial(coefficients, variable);
  }
  static random(maxOrder: number, variable: string = "x") {
    if (maxOrder < 0) {
      throw Error("Order must be a non-negative integer");
    }
    const order = randint(1, maxOrder + 1);
    const coefficients = [];
    for (let i = 0; i <= order - 1; i++) {
      coefficients.push(randint(-9, 10));
    }
    coefficients.push(randint(-9, 10, [0]));

    return new Polynomial(coefficients, variable);
  }

  /**
   *
   * @param maxOrder included
   * @param length
   * @param variable
   * @returns
   */
  static randomWithLength(
    maxOrder: number,
    length: number,
    variable: string = "x",
  ) {
    if (maxOrder < 0) {
      throw Error("Order must be a non-negative integer");
    }
    const order = randint(1, maxOrder + 1);
    const coefficients = [];
    const otherTermDegrees: number[] = [];
    for (let i = 0; i < length - 1; i++) {
      otherTermDegrees.push(randint(0, order));
    }
    for (let i = 0; i <= order - 1; i++) {
      if (otherTermDegrees.includes(i)) coefficients.push(randint(-9, 10, [0]));
      else coefficients.push(0);
    }
    coefficients.push(randint(-9, 10, [0]));

    return new Polynomial(coefficients, variable);
  }

  static randomWithLengthAndSameSigns(
    maxOrder: number,
    length: number,
    variable: string = "x",
  ) {
    if (maxOrder < 0) {
      throw Error("Order must be a non-negative integer");
    }
    const order = randint(1, maxOrder + 1);
    const coefficients = [];
    const otherTermDegrees: number[] = [];
    const sign = coinFlip() ? 1 : -1;
    for (let i = 0; i < length - 1; i++) {
      otherTermDegrees.push(randint(0, order));
    }
    for (let i = 0; i <= order - 1; i++) {
      if (otherTermDegrees.includes(i))
        coefficients.push(sign * randint(0, 10, [0]));
      else coefficients.push(0);
    }
    coefficients.push(sign * randint(0, 10, [0]));

    return new Polynomial(coefficients, variable);
  }
  static randomNoFI(
    maxOrder: number,
    to: "+\\infty" | "-\\infty",
    length?: number,
    variable: string = "x",
  ) {
    if (maxOrder < 0) {
      throw Error("Order must be a non-negative integer");
    }
    const order = randint(1, maxOrder + 1);

    const fixedLength = length ?? order;
    if (to === "+\\infty") {
      return PolynomialConstructor.randomWithLengthAndSameSigns(
        maxOrder,
        fixedLength,
        variable,
      );
    }
    //en -infini les degrés de parité différentes doivent avoir un signe différent
    const coefficients = [];
    const otherTermDegrees: number[] = [];
    const signEven = coinFlip() ? 1 : -1;
    for (let i = 0; i < fixedLength - 1; i++) {
      otherTermDegrees.push(randint(0, order));
    }
    for (let i = 0; i <= order - 1; i++) {
      if (otherTermDegrees.includes(i))
        coefficients.push(
          (i % 2 === 0 ? signEven : -signEven) * randint(0, 10, [0]),
        );
      else coefficients.push(0);
    }
    coefficients.push(
      (order % 2 === 0 ? signEven : -signEven) * randint(0, 10, [0]),
    );

    return new Polynomial(coefficients, variable);
  }
}

export class Polynomial {
  degree: number;
  variable: string;
  /**
   * coefficients[i] est le coeff de x^i
   */
  coefficients: number[];

  /**
   *
   * @param coefficients coefficients[i] est le coeff de x^i
   * @param variable
   */
  constructor(coefficients: number[], variable: string = "x") {
    if (coefficients.length === 0) throw Error("coeffs must be not null");
    if (
      coefficients.length > 1 &&
      coefficients[coefficients.length - 1] === 0
    ) {
      throw Error("n-th coeff must be not null");
    }
    this.coefficients = coefficients;
    this.variable = variable;
    this.degree = coefficients.length - 1;
  }
  equals(P: Polynomial): boolean {
    return (
      P.degree === this.degree &&
      this.coefficients.every((coeff, i) => coeff === P.coefficients[i])
    );
  }
  getRoots(): number[] {
    const roots: number[] = [];

    if (this.degree === 0) {
      return this.coefficients[0] === 0 ? [0] : [];
    }
    if (this.degree === 1) {
      // Polynôme de degré 1 : ax + b = 0
      const a = this.coefficients[1];
      const b = this.coefficients[0];

      if (a !== 0) {
        roots.push(-b / a);
      }
    } else if (this.degree === 2) {
      // Polynôme de degré 2 : ax^2 + bx + c = 0
      const a = this.coefficients[2];
      const b = this.coefficients[1];
      const c = this.coefficients[0];
      const delta = b * b - 4 * a * c;

      if (delta > 0) {
        roots.push((-b + Math.sqrt(delta)) / (2 * a));
        roots.push((-b - Math.sqrt(delta)) / (2 * a));
      } else if (delta === 0) {
        roots.push(-b / (2 * a));
      }
    } else {
      //méthode de Newton-Raphson ou des bibliothèques de calcul symbolique pour obtenir les racines.
      throw Error("general roots not implemented yet");
    }

    return roots.sort((a, b) => a - b);
  }
  add(P: Polynomial | number): Polynomial {
    if (typeof P === "number") {
      return new Polynomial(
        [this.coefficients[0] + P, ...this.coefficients.slice(1)],
        this.variable,
      );
    }
    if (P.variable !== this.variable)
      throw Error("Can't add two polynomials with different variables");

    const maxDegree = Math.max(P.degree, this.degree);

    const res: number[] = [];
    for (let i = 0; i < maxDegree + 1; i++) {
      res[i] = (P.coefficients[i] ?? 0) + (this.coefficients[i] ?? 0);
    }
    let firstNonZeroIndex = res.length;
    for (let i = res.length - 1; i > -1; i--) {
      if (res[i] !== 0) break;
      firstNonZeroIndex = i;
    }
    let coeffs = res.slice(0, firstNonZeroIndex);
    if (!coeffs.length) coeffs = [0];
    return new Polynomial(coeffs, this.variable);
  }
  times(nb: number): Polynomial {
    if (nb === 0) return new Polynomial([0], this.variable);
    return new Polynomial(
      this.coefficients.map((coeff) => coeff * nb),
      this.variable,
    );
  }

  multiply(Q: Polynomial): Polynomial {
    if (Q.variable !== this.variable)
      throw Error("Can't multiply two polynomials with different variables");

    const p = this.degree;
    const q = Q.degree;
    const res: number[] = Array.apply(0, new Array(this.degree)).map((i) => 0);

    for (let k = 0; k <= p + q; k++) {
      let sum = 0;
      for (let m = 0; m <= k; m++) {
        sum += (this.coefficients[m] || 0) * (Q.coefficients[k - m] || 0);
      }
      res[k] = sum;
    }
    let firstNonZeroIndex = res.length;
    for (let i = res.length - 1; i > -1; i--) {
      if (res[i] !== 0) break;
      firstNonZeroIndex = i;
    }
    return new Polynomial(res.slice(0, firstNonZeroIndex), this.variable);
  }

  scalarDivide(n: number): Polynomial {
    return new Polynomial(
      this.coefficients.map((coeff) => coeff / n),
      this.variable,
    );
  }

  // divide(Q: Polynomial): Polynomial {
  //   function n / d is
  //   require d ≠ 0
  //   q ← 0
  //   r ← n             // At each step n = d × q + r

  //   while r ≠ 0 and degree(r) ≥ degree(d) do
  //       t ← lead(r) / lead(d)       // Divide the leading terms
  //       q ← q + t
  //       r ← r − t × d

  //   return (q, r)

  // }
  opposite(): Polynomial {
    return new Polynomial(
      this.coefficients.map((coeff) => -coeff),
      this.variable,
    );
  }

  derivate(): Polynomial {
    if (this.coefficients.length === 1)
      return new Polynomial([0], this.variable);
    const res: number[] = [];

    for (let i = 1; i < this.coefficients.length; i++)
      res.push(i * this.coefficients[i]);

    return new Polynomial(res, this.variable);
  }

  secondDerivate(): Polynomial {
    if (this.coefficients.length <= 2)
      return new Polynomial([0], this.variable);
    const res: number[] = [];
    for (let i = 2; i < this.coefficients.length; i++)
      res.push(i * (i - 1) * this.coefficients[i]);
    return new Polynomial(res, this.variable);
  }

  // integrate(): Polynomial {
  //   const newCoefficients = this.coefficients.map(
  //     (coeff, exp) => coeff / (exp + 1),
  //   );
  //   newCoefficients.unshift(0);
  //   return new Polynomial(newCoefficients, this.variable);
  // }

  integrateToNode(opts?: NodeOptions) {
    let integralPolynomial: AlgebraicNode = new VariableNode("C");
    const varNode = new VariableNode(this.variable);
    for (let i = 0; i < this.degree + 1; i++) {
      const coeff = this.coefficients[i];
      if (coeff === 0) continue;
      const nodeCoeff = new Rational(coeff, i + 1).simplify().toTree();
      const powerNode =
        i + 1 === 1
          ? varNode
          : new PowerNode(varNode, new NumberNode(i + 1), opts);

      let terme;
      const coeffTex = nodeCoeff.toTex();
      if (coeffTex === "1") terme = powerNode;
      else if (coeffTex === "-1") terme = new OppositeNode(powerNode, opts);
      else {
        terme = new MultiplyNode(
          nodeCoeff,
          i + 1 === 1
            ? varNode
            : new PowerNode(varNode, new NumberNode(i + 1), opts),
          opts,
        );
      }

      integralPolynomial = new AddNode(terme, integralPolynomial, opts);
    }
    return integralPolynomial;
  }

  calculate(x: number): number {
    let res = 0;
    for (let i = 0; i < this.coefficients.length; i++)
      res += x ** i * this.coefficients[i];
    return res;
  }

  getLimit(to: "+\\infty" | "-\\infty"): string {
    const leadingCoeff = this.coefficients[this.coefficients.length - 1];
    if (this.degree === 0) return leadingCoeff + "";
    if (to === "+\\infty") {
      if (leadingCoeff > 0) return "+\\infty";
      return "-\\infty";
    } else {
      if (leadingCoeff > 0) {
        if (this.degree % 2 === 0) return "+\\infty";
        return "-\\infty";
      } else {
        if (this.degree % 2 === 0) return "-\\infty";
        return "+\\infty";
      }
    }
  }

  getLimitNode(to: "+\\infty" | "-\\infty") {
    const leadingCoeff = this.coefficients[this.coefficients.length - 1];
    if (this.degree === 0) return new NumberNode(leadingCoeff);
    if (to === "+\\infty") {
      if (leadingCoeff > 0) return PlusInfinityNode;
      return MinusInfinityNode;
    } else {
      if (leadingCoeff > 0) {
        if (this.degree % 2 === 0) return PlusInfinityNode;
        return MinusInfinityNode;
      } else {
        if (this.degree % 2 === 0) return MinusInfinityNode;
        return PlusInfinityNode;
      }
    }
  }

  toTree(opts?: NodeOptions) {
    const recursive = (cursor: number): AlgebraicNode => {
      const coeff = this.coefficients[cursor];
      if (coeff === 0) return recursive(cursor - 1);

      if (cursor === 0) {
        return new NumberNode(coeff);
      }

      const monome =
        cursor > 1
          ? new PowerNode(
              new VariableNode(this.variable),
              new NumberNode(cursor),
              opts,
            )
          : new VariableNode(this.variable);

      let res: AlgebraicNode;
      if (coeff === 1) res = monome;
      else if (coeff === -1) res = new OppositeNode(monome);
      else res = new MultiplyNode(new NumberNode(coeff), monome, opts);

      let nextCoeff;
      for (let i = cursor - 1; i > -1; i--) {
        if (this.coefficients[i]) {
          nextCoeff = this.coefficients[i];
          break;
        }
      }
      if (nextCoeff) {
        return new AddNode(res, recursive(cursor - 1));
      } else {
        return res;
      }
    };
    return recursive(this.degree);
  }

  toTex(): string {
    let s = "";
    for (let i = this.degree; i > -1; i--) {
      const coeff = this.coefficients[i];
      if (coeff === 0) continue;
      if (i === 0) s += coeff > 0 ? `+${coeff}` : coeff;
      else if (i === this.degree) {
        s += coeff === 1 ? "" : coeff === -1 ? "-" : coeff;
      } else {
        s +=
          coeff === 1
            ? "+"
            : coeff === -1
            ? "-"
            : coeff > 0
            ? `+${coeff}`
            : coeff;
      }
      //x^n
      if (i === 0) continue;
      if (i === 1) s += this.variable;
      else s += `${this.variable}^{${i}}`;
    }
    return s;
  }
  toString(): string {
    return this.toTex().replace(/\{/g, "(").replace(/\}/g, ")");
  }
}
