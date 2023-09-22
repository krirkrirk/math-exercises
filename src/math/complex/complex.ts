import { ComplexNode } from '#root/tree/nodes/complex/complexNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { Rational } from '../numbers/rationals/rational';
import { randint } from '../utils/random/randint';

export abstract class ComplexConstructor {
  static random() {
    const re = randint(-10, 11);
    let im = 0;
    do {
      im = randint(-10, 11);
    } while (re === 0 && im === 0);
    return new Complex(re, im);
  }
  static randomNotReal() {
    const re = randint(-10, 11);
    let im = 0;
    do {
      im = randint(-10, 11, [0]);
    } while (re === 0 && im === 0);
    return new Complex(re, im);
  }
}
export class Complex {
  re: number;
  im: number;
  constructor(re: number, im: number) {
    this.re = re;
    this.im = im;
  }
  moduleSquared() {
    return this.re ** 2 + this.im ** 2;
  }

  inverseNode() {
    const moduleSq = this.moduleSquared();
    const conj = this.conjugate();
    const invRe = new Rational(conj.re, moduleSq).simplify().toTree();
    const invIm = new Rational(conj.im, moduleSq).simplify().toTree();
    return new AddNode(invRe, new MultiplyNode(invIm, new VariableNode('i')));
  }

  divideNode(z: Complex) {
    const moduleSq = z.moduleSquared();
    const newRe = new Rational(this.re * z.re + this.im * z.im, moduleSq).simplify().toTree();
    const newIm = new Rational(this.im * z.re - z.im * this.re, moduleSq).simplify().toTree();
    return new AddNode(newRe, new MultiplyNode(newIm, new VariableNode('i')));
  }

  multiply(z: Complex) {
    return new Complex(this.re * z.re - this.im * z.im, this.re * z.im + this.im * z.re);
  }
  opposite() {
    return new Complex(-this.re, -this.im);
  }
  conjugate() {
    return new Complex(this.re, -this.im);
  }
  toTree() {
    return new ComplexNode(this.re, this.im);
  }
}
