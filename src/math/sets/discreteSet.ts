import { Nombre } from "../numbers/nombre";
import { random } from "../utils/random";
import { MathSetInterface } from "./mathSetInterface";

export class DiscreteSet implements MathSetInterface {
  elements: Nombre[];
  tex: string;
  constructor(elements: Nombre[]) {
    this.elements = Array.from(new Set(elements));
    let tex = "\\{";
    this.elements.forEach((el, index) => {
      tex += el.tex;
      if (index < this.elements.length - 1) tex += ";";
      else tex += "\\}";
    });
    this.tex = tex;
  }

  toTex(): string {
    return this.tex;
  }

  includes(el: Nombre): boolean {
    return this.elements.some((nb) => nb.value === el.value && nb.tex === el.tex);
  }

  getRandomElement(): Nombre {
    return random(this.elements);
  }
}
