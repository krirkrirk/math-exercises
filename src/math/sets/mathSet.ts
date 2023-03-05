import { Nombre } from "../numbers/nombre";
import { DiscreteSet } from "./discreteSet";
import { MathSetInterface } from "./mathSetInterface";

export class MathSet implements MathSetInterface {
  tex: string;
  getRandomElement: () => Nombre;
  constructor(tex: string, getRandomElement: () => Nombre) {
    this.tex = tex;
    this.getRandomElement = getRandomElement;
  }
}
