import { sqrt } from "#root/tree/nodes/functions/sqrtNode";
import { add } from "#root/tree/nodes/operators/addNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { square } from "#root/tree/nodes/operators/powerNode";
import { substract } from "#root/tree/nodes/operators/substractNode";
import { opposite } from "#root/tree/nodes/functions/oppositeNode";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { randint } from "../utils/random/randint";
import { random } from "#root/utils/alea/random";
import { NodeType } from "#root/tree/nodes/node";
import {
  NodeConstructor,
  NodeIdentifiers,
} from "#root/tree/nodes/nodeConstructor";

export abstract class GeneralTrinomConstructor {
  static random(
    aOpts?: { min?: number; max?: number; excludes?: number[] },
    bOpts?: { min?: number; max?: number; excludes?: number[] },
    cOpts?: { min?: number; max?: number; excludes?: number[] },
  ): GeneralTrinom {
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

    return new GeneralTrinom(a, b, c);
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
  ): GeneralTrinom {
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
    return new GeneralTrinom(a, b, c);
  }
  static randomNiceRoots(nbOfRoots: number = 2) {
    if (nbOfRoots === 0) {
      //canonical +c
      const a = randint(-9, 10, [0]);
      const root = randint(-9, 10);
      //a(x-root)^2 = ax^2 -2arootx + aroot^2
      const c =
        a > 0 ? a * root ** 2 + randint(1, 6) : a * root ** 2 - randint(1, 6);
      return new GeneralTrinom(a, -2 * a * root, c);
    } else if (nbOfRoots === 1) {
      const a = randint(-9, 10, [0]);
      const root = randint(-9, 10);
      //a(x-root)^2 = ax^2 -2arootx + aroot^2
      return new GeneralTrinom(a, -2 * a * root, a * root ** 2);
    } else {
      const a = randint(-9, 10, [0]);
      const x1 = randint(-9, 10, []);
      const x2 = randint(-9, 10, [x1]);
      return new GeneralTrinom(a, -a * (x1 + x2), a * x1 * x2);
    }
  }
  static fromCoeffs(coeffs: number[]) {
    return new GeneralTrinom(coeffs[2], coeffs[1], coeffs[0]);
  }

  static fromIdentifiers(identifiers: GeneralTrinomIdentifiers) {
    return new GeneralTrinom(
      typeof identifiers.a === "number"
        ? identifiers.a
        : (NodeConstructor.fromIdentifiers(identifiers.a) as AlgebraicNode),
      typeof identifiers.b === "number"
        ? identifiers.b
        : (NodeConstructor.fromIdentifiers(identifiers.b) as AlgebraicNode),
      typeof identifiers.c === "number"
        ? identifiers.c
        : (NodeConstructor.fromIdentifiers(identifiers.c) as AlgebraicNode),
      identifiers.opts,
    );
  }
}

export type GeneralTrinomIdentifiers = {
  a: number | NodeIdentifiers;
  b: number | NodeIdentifiers;
  c: number | NodeIdentifiers;
  opts?: GeneralTrinomOptions;
};

type GeneralTrinomOptions = { variable: string };
export class GeneralTrinom {
  a: AlgebraicNode;
  b: AlgebraicNode;
  c: AlgebraicNode;
  variable: string;
  type: NodeType = NodeType.trinom;
  // roots: AlgebraicNode[];
  constructor(
    a: AlgebraicNode | number,
    b: AlgebraicNode | number,
    c: AlgebraicNode | number,
    opts?: GeneralTrinomOptions,
  ) {
    // super([c, b, a], opts?.variable ?? "x");
    this.a = typeof a === "number" ? a.toTree() : a;
    this.b = typeof b === "number" ? b.toTree() : b;
    this.c = typeof c === "number" ? c.toTree() : c;
    this.variable = opts?.variable ?? "x";
  }

  getDelta() {
    return substract(
      square(this.b),
      multiply(4, multiply(this.a, this.c)),
    ).simplify();
  }

  //   getRoots() {
  //     const delta = this.getDelta();
  //     if (delta < 0) return [];
  //     if (delta === 0) return [-this.b / (2 * this.a)];
  //     return [
  //       (-this.b - Math.sqrt(delta)) / (2 * this.a),
  //       (-this.b + Math.sqrt(delta)) / (2 * this.a),
  //     ].sort((a, b) => a - b);
  //   }

  getRoots(): AlgebraicNode[] {
    const delta = this.getDelta();
    const deltaEv = delta.evaluate();
    if (deltaEv < 0) return [];
    if (deltaEv === 0)
      return [frac(opposite(this.b), multiply(2, this.a)).simplify()];

    return [
      frac(
        substract(opposite(this.b), sqrt(delta)),
        multiply(2, this.a),
      ).simplify(),
      frac(add(opposite(this.b), sqrt(delta)), multiply(2, this.a)).simplify(),
    ].sort((a, b) => a.evaluate() - b.evaluate());
  }

  toTree() {
    const bEv = this.b.evaluate();
    const cEv = this.c.evaluate();
    const highMonom = multiply(this.a, square(this.variable));
    const middleMonom = multiply(this.b, this.variable);

    if (!bEv && !cEv) return highMonom;
    if (!cEv) return add(highMonom, middleMonom);
    if (!bEv) return add(highMonom, this.c);
    return add(highMonom, add(middleMonom, this.c));
  }

  toTex() {
    return this.toTree().toTex();
  }
  getCoeffs() {
    return [this.c.evaluate(), this.b.evaluate(), this.a.evaluate()];
  }

  toIdentifiers(): GeneralTrinomIdentifiers {
    return {
      a: this.a.toIdentifiers(),
      b: this.b.toIdentifiers(),
      c: this.c.toIdentifiers(),
      opts: { variable: this.variable },
    };
  }
}
