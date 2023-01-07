import { Expression } from "../expression/expression";

export class Polynomial implements Expression {
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
    if (coefficients[coefficients.length - 1] === 0) {
      console.log(coefficients);
      throw Error("n-th coeff must be not null");
    }
    this.coefficients = coefficients;
    this.variable = variable;
    this.degree = coefficients.length - 1;
  }
  equals(P: Polynomial): boolean {
    return P.degree === this.degree && this.coefficients.every((coeff, i) => coeff === P.coefficients[i]);
  }

  add(P: Polynomial): Polynomial {
    if (P.variable !== this.variable) throw Error("Can't add two polynomials with different variables");

    const newDegree =
      P.degree === this.degree && P.coefficients[P.degree] === -this.coefficients[this.degree]
        ? P.degree - 1
        : Math.max(P.degree, this.degree);

    const res: number[] = [];
    for (let i = 0; i < newDegree + 1; i++) {
      res[i] = P.coefficients[i] + this.coefficients[i];
    }
    return new Polynomial(res, this.variable);
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
      this.variable
    );
  }

  toTex(): string {
    // if (this.degree == 0) return "" + this.b;
    // function getMonome(power: number): string {
    //   if (power === 0) return "";
    //   if (power === 1) return this.variable;
    //   else return `${this.variable}^{${power}}`;
    // }

    // let s = this.coefficients[this.degree] + this.variable + this.degree > 1 ? `^{${this.degree}}` : "";
    let s = "";
    for (let i = this.degree; i > -1; i--) {
      const coeff = this.coefficients[i];
      if (coeff === 0) continue;
      if (i === 0) s += coeff > 0 ? `+${coeff}` : coeff;
      else if (i === this.degree) {
        s += coeff === 1 ? "" : coeff === -1 ? "-" : coeff;
      } else {
        s += coeff === 1 ? "+" : coeff === -1 ? "-" : coeff > 0 ? `+${coeff}` : coeff;
      }
      //x^n
      if (i === 0) continue;
      if (i === 1) s += this.variable;
      else s += `${this.variable}^{${i}}`;

      // latex.add(this.coefficients[i]);
      // s += addLatex(this.coefficients[i]);
      // s += this.coefficients[i] + this.variable + `^{${i}}`;
    }
    return s;
  }
  toString(): string {
    return this.toTex();
  }
}
