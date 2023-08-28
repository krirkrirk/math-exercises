import { Node } from '../../tree/nodes/node';
import { NumberNode } from '../../tree/nodes/numbers/numberNode';
import { AddNode } from '../../tree/nodes/operators/addNode';
import { MultiplyNode } from '../../tree/nodes/operators/multiplyNode';
import { OppositeNode } from '../../tree/nodes/functions/oppositeNode';
import { PowerNode } from '../../tree/nodes/operators/powerNode';
import { SubstractNode } from '../../tree/nodes/operators/substractNode';
import { VariableNode } from '../../tree/nodes/variables/variableNode';
import { randint } from '#root/math/utils/random/randint';

export function createRandomPolynomialWithOrder(order: number, variable: string = 'x'): Polynomial {
  if (order < 0) {
    throw Error('Order must be a non-negative integer');
  }

  const coefficients = [];
  for (let i = 0; i <= order - 1; i++) {
    coefficients.push(randint(-9, 10));
  }
  coefficients.push(randint(-9, 10, [0]));

  return new Polynomial(coefficients, variable);
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
  constructor(coefficients: number[], variable: string = 'x') {
    if (coefficients.length === 0) throw Error('coeffs must be not null');
    if (coefficients[coefficients.length - 1] === 0) {
      throw Error('n-th coeff must be not null');
    }
    this.coefficients = coefficients;
    this.variable = variable;
    this.degree = coefficients.length - 1;
  }
  equals(P: Polynomial): boolean {
    return P.degree === this.degree && this.coefficients.every((coeff, i) => coeff === P.coefficients[i]);
  }
  getRoots(): number[] {
    const roots: number[] = [];

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
    }

    return roots.sort((a, b) => a - b);
  }
  add(P: Polynomial): Polynomial {
    if (P.variable !== this.variable) throw Error("Can't add two polynomials with different variables");

    const newDegree =
      P.degree === this.degree && P.coefficients[P.degree] === -this.coefficients[this.degree]
        ? P.degree - 1
        : Math.max(P.degree, this.degree);

    const res: number[] = [];
    for (let i = 0; i < newDegree + 1; i++) {
      res[i] = (P.coefficients[i] ?? 0) + (this.coefficients[i] ?? 0);
    }
    return new Polynomial(res, this.variable);
  }
  times(nb: number): Polynomial {
    return new Polynomial(
      this.coefficients.map((coeff) => coeff * nb),
      this.variable,
    );
  }
  multiply(Q: Polynomial): Polynomial {
    if (Q.variable !== this.variable) throw Error("Can't multiply two polynomials with different variables");

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

    return new Polynomial(res, this.variable);
  }

  opposite(): Polynomial {
    return new Polynomial(
      this.coefficients.map((coeff) => -coeff),
      this.variable,
    );
  }

  derivate(): Polynomial {
    const res: number[] = [];

    for (let i = 1; i < this.coefficients.length; i++) res.push(i * this.coefficients[i]);

    return new Polynomial(res, this.variable);
  }

  calculate(x: number): number {
    let res = 0;
    for (let i = 0; i < this.coefficients.length; i++) res += x ** i * this.coefficients[i];
    return res;
  }

  toTree(): Node {
    const recursive = (cursor: number): Node => {
      const coeff = this.coefficients[cursor];
      if (coeff === 0) return recursive(cursor - 1);

      if (cursor === 0) {
        return new NumberNode(coeff);
      }

      const monome =
        cursor > 1
          ? new PowerNode(new VariableNode(this.variable), new NumberNode(cursor))
          : new VariableNode(this.variable);

      let res: Node;
      if (coeff === 1) res = monome;
      else if (coeff === -1) res = new OppositeNode(monome);
      else res = new MultiplyNode(new NumberNode(coeff), monome);

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
    let s = '';
    for (let i = this.degree; i > -1; i--) {
      const coeff = this.coefficients[i];
      if (coeff === 0) continue;
      if (i === 0) s += coeff > 0 ? `+${coeff}` : coeff;
      else if (i === this.degree) {
        s += coeff === 1 ? '' : coeff === -1 ? '-' : coeff;
      } else {
        s += coeff === 1 ? '+' : coeff === -1 ? '-' : coeff > 0 ? `+${coeff}` : coeff;
      }
      //x^n
      if (i === 0) continue;
      if (i === 1) s += this.variable;
      else s += `${this.variable}^{${i}}`;
    }
    return s;
  }
  toString(): string {
    return this.toTex();
  }
}
