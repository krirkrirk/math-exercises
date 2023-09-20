import { ComplexNode } from '#root/tree/nodes/complex/complexNode';
import { randint } from '../utils/random/randint';

export abstract class ComplexConstructor {
  static random() {
    return new Complex(randint(-10, 11), randint(-10, 11));
  }
}
export class Complex {
  re: number;
  im: number;
  constructor(re: number, im: number) {
    this.re = re;
    this.im = im;
  }
  conjugate() {
    return new Complex(this.re, -this.im);
  }
  toTree() {
    return new ComplexNode(this.re, this.im);
  }
}
