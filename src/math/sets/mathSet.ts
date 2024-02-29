import { Nombre } from '../numbers/nombre';
import { DiscreteSet } from './discreteSet';
import { MathSetInterface } from './mathSetInterface';

export class MathSet implements MathSetInterface {
  tex: string;
  toTex: () => string;
  getRandomElement: () => Nombre | null;
  constructor(tex: string, getRandomElement: () => Nombre | null) {
    this.tex = tex;
    this.getRandomElement = getRandomElement;
    this.toTex = () => tex;
  }
}
