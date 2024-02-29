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
import { randint } from "../utils/random/randint";
import { random } from "#root/utils/random";

export abstract class TrinomConstructor {
  static random(
    aOpts?: { min?: number; max?: number; excludes?: number[] },
    bOpts?: { min?: number; max?: number; excludes?: number[] },
    cOpts?: { min?: number; max?: number; excludes?: number[] },
  ): Trinom {
    const a = randint(
      aOpts?.min ?? -9,
      aOpts?.max ?? 10,
      aOpts?.excludes ?? [0],
    );
    const b = randint(
      bOpts?.min ?? -9,
      bOpts?.max ?? 10,
      bOpts?.excludes ?? [],
    );
    const c = randint(
      cOpts?.min ?? -9,
      cOpts?.max ?? 10,
      cOpts?.excludes ?? [],
    );

    return new Trinom(a, b, c);
  }
  static randomCanonical(
    aOpts?: {
      min?: number;
      max?: number;
      excludes?: number[];
      from?: number[];
    },
    alphaOpts?: { min?: number; max?: number; excludes?: number[] },
    betaOpts?: { min?: number; max?: number; excludes?: number[] },
  ): Trinom {
    const a = aOpts?.from
      ? random(aOpts.from)
      : randint(aOpts?.min ?? -9, aOpts?.max ?? 10, aOpts?.excludes ?? [0]);
    const alpha = randint(
      alphaOpts?.min ?? -9,
      alphaOpts?.max ?? 10,
      alphaOpts?.excludes ?? [],
    );
    const beta = randint(
      betaOpts?.min ?? -9,
      betaOpts?.max ?? 10,
      betaOpts?.excludes ?? [],
    );

    const b = -2 * a * alpha;
    const c = a * alpha ** 2 + beta;
    return new Trinom(a, b, c);
  }
  static randomFactorized(
    aOpts?: { min?: number; max?: number; excludes?: number[] },
    x1Opts?: { min?: number; max?: number; excludes?: number[] },
    x2Opts?: { min?: number; max?: number; excludes?: number[] },
  ): Trinom {
    const a = randint(
      aOpts?.min ?? -9,
      aOpts?.max ?? 10,
      aOpts?.excludes ?? [0],
    );
    const x1 = randint(
      x1Opts?.min ?? -9,
      x1Opts?.max ?? 10,
      x1Opts?.excludes ?? [],
    );
    const x2 = randint(
      x2Opts?.min ?? -9,
      x2Opts?.max ?? 10,
      x2Opts?.excludes ?? [],
    );

    //a*x^2 + ax*-x2 + a*-x1*x + a*-x1*-x2
    return new Trinom(a, -a * (x1 + x2), a * x1 * x2);
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
    ].sort((a, b) => a - b);
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
    if (!roots.length) return `S=\\varnothing`;
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
