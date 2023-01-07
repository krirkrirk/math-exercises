import { Nombre } from "../numbers/nombre";

export interface MathSetInterface {
  tex: string;
  getRandomElement: () => Nombre;
  //   constructor(tex: string, getRandomElement: () => number) {
  //     this.tex = tex;
  //     this.getRandomElement = getRandomElement;
  //   }
}
