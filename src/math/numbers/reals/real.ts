import { isSquare } from "#root/math/utils/arithmetic/isSquare";
import { primeFactors } from "#root/math/utils/arithmetic/primeFactors";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { diceFlip } from "#root/utils/alea/diceFlip";
import { random } from "#root/utils/alea/random";
import { Integer, IntegerConstructor } from "../integer/integer";
import { primes } from "../integer/primes";
import { Nombre, NumberType } from "../nombre";
export abstract class RealConstructor {
  static random() {
    const dice = diceFlip(2);
    switch (dice) {
      case 0:
        return new Real(Math.PI, "\\pi");
      case 1:
        return SquareRootConstructor.randomIrreductible();
    }
    return new Real(Math.PI, "\\pi");
  }
}
export class Real implements Nombre {
  value: number;
  tex: string;
  type: NumberType;
  constructor(value: number, tex: string) {
    this.value = value;
    this.tex = tex;
    this.type = NumberType.Real;
  }
  equals(n: Nombre) {
    return this.value === n.value;
  }
  toTree(): AlgebraicNode {
    if (this.tex === "\\pi") return PiNode;
    return new NumberNode(this.value);
  }
}

export abstract class SquareRootConstructor {
  /**
   * @returns simplifiable square root type sqrt(c)=a*sqrt(b)
   */
  static randomSimplifiable({
    allowPerfectSquare = false,
    maxSquare = 11,
  }): SquareRoot {
    const a = randint(2, maxSquare);
    let b;
    let bMin = allowPerfectSquare ? 1 : 2;
    do {
      b = randint(bMin, maxSquare);
    } while (b % (a * a) === 0 || isSquare(b));
    return new SquareRoot(a * a * b);
  }
  static randomIrreductible(max: number = 15): SquareRoot {
    const a = random(primes.filter((p) => p < max));
    return new SquareRoot(a);
  }
}

export class SquareRoot extends Real {
  operand: number;
  constructor(operand: number) {
    super(Math.sqrt(operand), `\\sqrt{${operand}}`);
    this.operand = operand;
  }

  isSimplifiable() {
    if (this.operand === 0 || this.operand === 1) return true;
    const [a, b] = this.getSimplifiedCoeffs();
    return a !== 1;
  }

  getSimplifiedCoeffs(): [number, number] {
    if (this.operand === 0) return [1, 0];
    const factors = primeFactors(this.operand);
    // finds primes with even exponents
    const multiples = [1];
    for (let i = 0; i < factors.length - 1; i++) {
      if (factors[i] === factors[i + 1]) {
        multiples.push(factors[i]);
        factors.splice(i, 2);
        i--;
      }
    }
    const outsideSqrt = multiples.reduce((x, y) => x * y);
    const insideSqrt =
      factors.length === 0 ? 1 : factors.reduce((x, y) => x * y);
    return [outsideSqrt, insideSqrt];
  }

  /**simplifier les carrés parfaits mais pas le reste */
  basicSimplify(): Nombre {
    if (Math.sqrt(this.operand) === this.operand) {
      return new Integer(this.operand);
    }
    return this;
  }
  simplify(): Nombre {
    if (this.operand === 0) return new Integer(0);
    if (this.operand === 1) return new Integer(1);
    const [outsideSqrt, insideSqrt] = this.getSimplifiedCoeffs();

    const simplified =
      insideSqrt !== 1
        ? new Real(
            outsideSqrt * Math.sqrt(insideSqrt),
            `${outsideSqrt === 1 ? "" : `${outsideSqrt}`}\\sqrt{${insideSqrt}}`,
          )
        : new Real(outsideSqrt, outsideSqrt + "");
    simplified.toTree = (): AlgebraicNode => {
      return insideSqrt !== 1
        ? outsideSqrt === 1
          ? new SqrtNode(new NumberNode(insideSqrt))
          : new MultiplyNode(
              new NumberNode(outsideSqrt),
              new SqrtNode(new NumberNode(insideSqrt)),
            )
        : new NumberNode(outsideSqrt);
    };
    return simplified;
  }

  toTex(): string {
    return this.tex;
  }

  toTree() {
    return new SqrtNode(new NumberNode(this.operand));
  }
}
