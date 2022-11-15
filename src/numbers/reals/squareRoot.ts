import { Real } from "./real";

export class SquareRoot implements Real {
  tex: string;
  constructor(operand: string) {
    this.tex = `\\sqrt{${operand}}`;
  }
  toTex(): string {
    return this.tex;
  }
}
