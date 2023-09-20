import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { Point } from '../geometry/point';
import { Integer } from '../numbers/integer/integer';
import { Nombre } from '../numbers/nombre';
import { DiscreteSet } from '../sets/discreteSet';
import { Interval } from '../sets/intervals/intervals';
import { MathSet } from '../sets/mathSet';
import { Polynomial } from './polynomial';

export abstract class TrinomConstructor {
  static random(
    domainA: MathSet = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)])),
    domainB: MathSet = new Interval('[[-10; 10]]'),
    domainC: MathSet = new Interval('[[-10; 10]]'),
  ): Trinom {
    const a = domainA.getRandomElement();
    const b = domainB.getRandomElement();
    const c = domainC.getRandomElement();

    return new Trinom(a.value, b.value, c.value);
  }
  static randomCanonical(
    domainA: MathSet = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)])),
    domainAlpha: MathSet = new Interval('[[-10; 10]]'),
    domainBeta: MathSet = new Interval('[[-10; 10]]'),
  ): Trinom {
    const a = domainA.getRandomElement();
    const alpha = domainAlpha.getRandomElement();
    const beta = domainBeta.getRandomElement();
    const b = -2 * a.value * alpha.value;
    const c = a.value * alpha.value ** 2 + beta.value;
    return new Trinom(a.value, b, c);
  }
}

export class Trinom extends Polynomial {
  a: number;
  b: number;
  c: number;
  variable: string;
  constructor(a: number, b: number, c: number, variable: string = 'x') {
    super([c, b, a], variable);
    this.a = a;
    this.b = b;
    this.c = c;
    this.variable = variable;
  }

  getDelta() {
    return this.b ** 2 - 4 * this.a * this.c;
  }
  getDeltaNode(): NumberNode {
    return new NumberNode(this.getDelta());
  }

  getAlpha() {
    return -this.b / (2 * this.a);
  }
  getAlphaNode(): Node {
    return simplifyNode(new FractionNode(new NumberNode(-this.b), new NumberNode(2 * this.a)));
  }

  getBeta() {
    return -this.getDelta() / (4 * this.a);
  }

  getBetaNode(): Node {
    return simplifyNode(new FractionNode(new NumberNode(-this.getDelta()), new NumberNode(4 * this.a)));
  }

  getCanonicalForm(): Node {
    return simplifyNode(
      new AddNode(
        new MultiplyNode(
          new NumberNode(this.a),
          new PowerNode(new SubstractNode(new VariableNode(this.variable), this.getAlphaNode()), new NumberNode(2)),
        ),
        new NumberNode(this.getBeta()),
      ),
    );
  }

  getSommet() {
    return new Point('S', this.getAlphaNode(), this.getBetaNode()).toTexWithCoords();
  }
}
