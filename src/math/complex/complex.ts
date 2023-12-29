import { ComplexNode } from "#root/tree/nodes/complex/complexNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { Rational } from "../numbers/rationals/rational";
import { SquareRoot } from "../numbers/reals/real";
import { randint } from "../utils/random/randint";

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
    return new ComplexNode(invRe, invIm);
  }

  add(z: Complex) {
    return new Complex(this.re + z.re, this.im + z.im);
  }
  divideNode(z: Complex) {
    const moduleSq = z.moduleSquared();
    const newRe = new Rational(this.re * z.re + this.im * z.im, moduleSq)
      .simplify()
      .toTree();
    const newIm = new Rational(this.im * z.re - z.im * this.re, moduleSq)
      .simplify()
      .toTree();
    return new ComplexNode(newRe, newIm);
  }

  multiply(z: Complex) {
    return new Complex(
      this.re * z.re - this.im * z.im,
      this.re * z.im + this.im * z.re,
    );
  }
  times(n: number) {
    return new Complex(this.re * n, this.im * n);
  }
  opposite() {
    return new Complex(-this.re, -this.im);
  }
  conjugate() {
    return new Complex(this.re, -this.im);
  }
  toArgumentTree() {
    if (this.re === 0 && this.im === 0) throw Error("0 n'a pas d'argument");
    if (this.re === 0) {
      const piOver2 = new FractionNode(PiNode, new NumberNode(2));
      if (this.im > 0) return piOver2;
      else return new OppositeNode(piOver2);
    }
    if (this.im === 0) {
      if (this.re > 0) return new NumberNode(0);
      else return PiNode;
    }
    if (this.re > 0) {
      //arctan(b/a)
    }
    if (this.im > 0) {
      //arctan(b/a)+pi
    }
    if (this.im < 0) {
      //arctan(b/a)-pi
    }
  }
  toModuleTree() {
    return new SquareRoot(this.re ** 2 + this.im ** 2).simplify().toTree();
  }
  toTree() {
    return new ComplexNode(new NumberNode(this.re), new NumberNode(this.im));
  }
}
