import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

export class Matrix {
  elements: AlgebraicNode[][];
  rows: number;
  columns: number;
  constructor(elements: AlgebraicNode[][]) {
    this.elements = elements;
    this.columns = elements[0].length;
    this.rows = elements.length;
  }
  determinant() {
    if (this.rows === 2 && this.columns === 2) {
      return new SubstractNode(
        new MultiplyNode(this.elements[0][0], this.elements[1][1]),
        new MultiplyNode(this.elements[0][1], this.elements[1][0]),
      ).simplify();
    }
    throw Error("general determinant not implemented yet");
  }

  toTex() {
    return `\\begin{pmatrix}${this.elements
      .map((row) => `${row.map((cell) => cell.toTex()).join("&")} \\\\[6pt]`)
      .join("")}\\end{pmatrix}`;
  }
}
