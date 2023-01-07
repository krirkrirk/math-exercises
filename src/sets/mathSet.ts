import { Nombre } from "../numbers/nombre";
import { MathSetInterface } from "./mathSetInterface";

export class MathSet<T> implements MathSetInterface {
  tex: string;
  getRandomElement: () => Nombre;
  constructor(tex: string, getRandomElement: () => Nombre) {
    this.tex = tex;
    this.getRandomElement = getRandomElement;
  }
}
