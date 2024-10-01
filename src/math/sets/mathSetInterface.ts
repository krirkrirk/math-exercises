import { Nombre } from "../numbers/nombre";

export interface MathSetInterface {
  tex: string;
  toTex: () => string;
  getRandomElement: () => Nombre | null;
}
