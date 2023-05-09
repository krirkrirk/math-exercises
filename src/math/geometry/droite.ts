import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { evaluate } from 'mathjs';
import { Point } from './point';
import { Polynomial } from '../polynomials/polynomial';
import { round } from '../utils/round';

export abstract class DroiteConstructor {
  static fromTwoPoints(A: Point, B: Point, name = 'd'): Droite {
    const a = new FractionNode(new SubstractNode(B.y, A.y), new SubstractNode(B.x, A.x));
    const b = new SubstractNode(A.y, new MultiplyNode(a, A.x));
    return new Droite(name, simplifyNode(a), simplifyNode(b));
  }

  static fromPointAndSlope(A: Point, m: Node, name = 'd'): Droite {
    return new Droite(name, simplifyNode(m), simplifyNode(new SubstractNode(A.y, new MultiplyNode(m, A.x))));
  }

  static fromPointAndAngle(A: Point, theta: Node, name = 'd'): Droite {
    const m = new NumberNode(round(Math.tan(parseFloat(theta.toMathString())), 2));
    const b = new SubstractNode(A.y, new MultiplyNode(m, A.x));
    return new Droite(name, simplifyNode(m), simplifyNode(b));
  }
}

export class Droite {
  name: string;
  a: Node;
  b: Node;

  constructor(name = 'D', a: Node, b: Node) {
    // ax + b
    this.name = name;
    this.a = a;
    this.b = b;
  }

  toTex(): string {
    return `${this.name}`;
  }

  toEquationForm(): string {
    return `${this.a.toTex()}x + ${this.b.toTex()}`;
  }

  toEquationExpression(): string {
    return `(${this.name}) : y = ${this.toEquationForm()}`; // (D) : y = ax + b
  }

  toPolynome(): string {
    const polynome = new Polynomial([evaluate(this.b.toMathString()), evaluate(this.a.toMathString())], 'x');
    return polynome.toTex();
  }

  getLeadingCoefficient(): string {
    return `${simplifyNode(this.a).toTex()}`;
  }
  // TODO : ajouter des conditions ou cas ou les deux droites sont Parallèles
  intersection(D: Droite, name = 'P'): Point | void {
    if (evaluate(D.a.toMathString()) === evaluate(this.a.toMathString())) return;
    const x = new FractionNode(new SubstractNode(D.b, this.b), new SubstractNode(this.a, D.a));
    const y = new AddNode(new MultiplyNode(this.a, x), this.b);
    return new Point(name, simplifyNode(x), simplifyNode(y));
  }
}
