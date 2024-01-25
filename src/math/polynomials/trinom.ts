import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode, SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Point } from "../geometry/point";
import { Integer } from "../numbers/integer/integer";
import { Nombre } from "../numbers/nombre";
import { Rational } from "../numbers/rationals/rational";
import { SquareRoot } from "../numbers/reals/real";
import { DiscreteSet } from "../sets/discreteSet";
import { Interval } from "../sets/intervals/intervals";
import { MathSet } from "../sets/mathSet";
import { Polynomial } from "./polynomial";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { gcd } from "../utils/arithmetic/gcd";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";

export abstract class TrinomConstructor {
  static random(
    domainA: MathSet = new Interval("[[-10; 10]]").difference(
      new DiscreteSet([new Integer(0)]),
    ),
    domainB: MathSet = new Interval("[[-10; 10]]"),
    domainC: MathSet = new Interval("[[-10; 10]]"),
  ): Trinom {
    const a = domainA.getRandomElement();
    const b = domainB.getRandomElement();
    const c = domainC.getRandomElement();
    if (a === null || b === null || c === null)
      throw Error("received null in random trinom");

    return new Trinom(a.value, b.value, c.value);
  }
  static randomCanonical(
    domainA: MathSet = new Interval("[[-10; 10]]").difference(
      new DiscreteSet([new Integer(0)]),
    ),
    domainAlpha: MathSet = new Interval("[[-10; 10]]"),
    domainBeta: MathSet = new Interval("[[-10; 10]]"),
  ): Trinom {
    const a = domainA.getRandomElement();
    const alpha = domainAlpha.getRandomElement();
    const beta = domainBeta.getRandomElement();
    if (a === null || alpha === null || beta === null)
      throw Error("received null in random canonical");
    const b = -2 * a.value * alpha.value;
    const c = a.value * alpha.value ** 2 + beta.value;
    return new Trinom(a.value, b, c);
  }
  static randomFactorized(
    domainA: MathSet = new Interval("[[-10; 10]]").difference(
      new DiscreteSet([new Integer(0)]),
    ),
    domainX1: MathSet = new Interval("[[-10; 10]]"),
    domainX2: MathSet = new Interval("[[-10; 10]]"),
  ): Trinom {
    const a = domainA.getRandomElement();
    const x1 = domainX1.getRandomElement();
    const x2 = domainX2.getRandomElement();
    if (a === null || x1 === null || x2 === null)
      throw Error("received null in random factorized");

    //a*x^2 + ax*-x2 + a*-x1*x + a*-x1*-x2
    return new Trinom(
      a.value,
      -a.value * (x1.value + x2.value),
      a.value * x1.value * x2.value,
    );
  }
}

export class Trinom extends Polynomial {
  a: number;
  b: number;
  c: number;
  variable: string;
  constructor(a: number, b: number, c: number, variable: string = "x") {
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

  getRoots() {
    const delta = this.getDelta();
    if (delta < 0) return [];
    if (delta === 0) return [-this.b / (2 * this.a)];
    return [
      (-this.b - Math.sqrt(delta)) / (2 * this.a),
      (-this.b + Math.sqrt(delta)) / (2 * this.a),
    ];
  }

  getRootsNode(): AlgebraicNode[] {
    const delta = this.getDelta();
    if (delta < 0) return [];
    if (delta === 0)
      return [new Rational(-this.b, 2 * this.a).simplify().toTree()];
    const sqrtDelta = Math.sqrt(delta);
    const isDeltaPerfectSquare =
      Math.sqrt(delta) === Math.floor(Math.sqrt(delta));
    if (isDeltaPerfectSquare) {
      const addNode = new Rational(-this.b + sqrtDelta, 2 * this.a)
        .simplify()
        .toTree();
      const subNode = new Rational(-this.b - sqrtDelta, 2 * this.a)
        .simplify()
        .toTree();
      return this.a > 0 ? [subNode, addNode] : [addNode, subNode];
    }
    let [sqrtA, sqrtB] = new SquareRoot(delta).getSimplifiedCoeffs();
    let denum = 2 * this.a;
    let trueB = this.b;
    const pgcd = gcd(sqrtA, trueB, denum);

    [sqrtA, trueB, denum] = [sqrtA, trueB, denum].map((n) => n / pgcd);

    const sqrtNode =
      sqrtA === 1
        ? new SqrtNode(new NumberNode(sqrtB))
        : new MultiplyNode(
            new NumberNode(sqrtA),
            new SqrtNode(new NumberNode(sqrtB)),
          );
    const subNode =
      trueB === 0
        ? new OppositeNode(sqrtNode)
        : new AddNode(new NumberNode(-trueB), new OppositeNode(sqrtNode));
    const addNode =
      trueB === 0 ? sqrtNode : new AddNode(new NumberNode(-trueB), sqrtNode);
    if (denum === 1) {
      return this.a > 0 ? [subNode, addNode] : [addNode, subNode];
    } else {
      return this.a > 0
        ? [
            new FractionNode(subNode, new NumberNode(denum)),
            new FractionNode(addNode, new NumberNode(denum)),
          ]
        : [
            new FractionNode(addNode, new NumberNode(denum)),
            new FractionNode(subNode, new NumberNode(denum)),
          ];
    }
  }

  getRootsEquationSolutionTex() {
    const roots = this.getRootsNode();
    if (!roots.length) return `S=\\emptyset`;
    if (roots.length === 1) return `S=\\left\\{${roots[0].toTex()}\\right\\}`;
    return `S=\\left\\{${roots[0].toTex()};${roots[1].toTex()}\\right\\}`;
  }

  getAlpha() {
    return -this.b / (2 * this.a);
  }
  getAlphaNode() {
    return new Rational(-this.b, 2 * this.a).simplify().toTree();
  }

  getBeta() {
    return -this.getDelta() / (4 * this.a);
  }

  getBetaNode() {
    return new Rational(-this.getDelta(), 4 * this.a).simplify().toTree();
  }

  getFactorizedForm() {
    const roots = this.getRootsNode();
    if (!roots.length) return this.toTree();
    if (roots.length === 1) {
      return roots[0].toTex() === "0"
        ? new MultiplyNode(
            new NumberNode(this.a),
            new SquareNode(new VariableNode("x")),
          )
        : new MultiplyNode(
            new NumberNode(this.a),
            new SquareNode(
              new AddNode(new VariableNode("x"), new OppositeNode(roots[0])),
            ),
          );
    }

    if (roots[0].toTex() === "0") {
      return new MultiplyNode(
        new NumberNode(this.a),
        new MultiplyNode(
          new VariableNode("x"),
          new AddNode(new VariableNode("x"), new OppositeNode(roots[1])),
        ),
      );
    } else if (roots[1].toTex() === "0") {
      return new MultiplyNode(
        new NumberNode(this.a),
        new MultiplyNode(
          new VariableNode("x"),
          new AddNode(new VariableNode("x"), new OppositeNode(roots[0])),
        ),
      );
    } else {
      return new MultiplyNode(
        new NumberNode(this.a),
        new MultiplyNode(
          new AddNode(new VariableNode("x"), new OppositeNode(roots[0])),
          new AddNode(new VariableNode("x"), new OppositeNode(roots[1])),
        ),
      );
    }
  }

  getCanonicalForm() {
    const alpha = this.getAlpha();
    let square: AlgebraicNode;
    if (alpha !== 0) {
      square = new SquareNode(
        new AddNode(
          new VariableNode(this.variable),
          new OppositeNode(this.getAlphaNode()),
        ),
      );
    } else {
      square = new SquareNode(new VariableNode(this.variable));
    }
    const beta = this.getBeta();
    return beta !== 0
      ? new AddNode(
          new MultiplyNode(new NumberNode(this.a), square),
          new NumberNode(this.getBeta()),
        )
      : new MultiplyNode(new NumberNode(this.a), square);
  }

  getSommet() {
    return new Point("S", this.getAlphaNode(), this.getBetaNode());
  }
}
