import { Expression } from "../expression/expression";

export abstract class LatexConstructor {
  static fromString(s: string): Latex {
    return new Latex(s);
  }
  static monome(n: number, l: Latex) {
    return;
  }
}
export class Latex {
  tex: string;
  constructor(tex: string) {
    this.tex = tex;
  }

  toTex(): string {
    return this.tex;
  }

  add(term: number | Expression): string {
    let s = this.tex;
    switch (typeof term) {
      case "number":
        this.tex += term === 0 ? "" : `${term > 0 ? "+" : ""}${term}`;
        break;
      default:
        break;
    }
    return this.tex;
    // return new Latex(s);
  }

  //créer un type monome ?
}
