import { Nombre } from '../numbers/nombre';

export interface MathSetInterface {
  tex: string;
  getRandomElement: () => Nombre;
}
