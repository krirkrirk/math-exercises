import { MathSetInterface } from "./mathSetInterface";

export class MathSet<T> implements MathSetInterface<T> {
  tex: string;
  getRandomElement: () => T;
  constructor(tex: string, getRandomElement: () => T) {
    this.tex = tex;
    this.getRandomElement = getRandomElement;
  }
}
