export abstract class EquationConstructor {
  firstDegree({ tex: string }) {}
}

export class Equation {
  leftTerm: string;
  rightTerm: string;
  solution: string;
  constructor(leftTerm: string, rightTerm: string, solution: string = "") {
    this.leftTerm = leftTerm;
    this.rightTerm = rightTerm;
    this.solution = solution;
  }

  toTex() {
    return `${this.leftTerm} = ${this.rightTerm}`;
  }
}
