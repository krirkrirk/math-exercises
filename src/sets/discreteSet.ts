import { random } from "../utils/random";
import { MathSetInterface } from "./mathSetInterface";

export class DiscreteSet<T> implements MathSetInterface<T> {
  elements: T[];
  tex: string;
  constructor(elements: T[]) {
    this.elements = Array.from(new Set(elements));
    let tex = "{";
    this.elements.forEach((el, index) => {
      tex += el;
      if (index < this.elements.length - 1) tex += ";";
      else tex += "}";
    });
    this.tex = tex;
  }

  toTex(): string {
    return this.tex;
  }

  includes(el: T): boolean {
    return this.elements.includes(el);
  }

  getRandomElement(): T {
    return random(this.elements);
  }
}
