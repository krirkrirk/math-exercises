import { isSquare } from '#root/math/utils/arithmetic/isSquare';
import { primeFactors } from '#root/math/utils/arithmetic/primeFactors';
import { randint } from '#root/math/utils/random/randint';
import { SqrtNode } from '#root/tree/nodes/functions/sqrtNode';
import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { Real } from './real';

export abstract class SquareRootConstructor {
  /**
   * @returns simplifiable square root type sqrt(c)=a*sqrt(b)
   */
  static randomSimplifiable({ allowPerfectSquare = false, maxSquare = 11 }): SquareRoot {
    const a = randint(2, maxSquare);
    let b;
    let bMin = allowPerfectSquare ? 1 : 2;
    do {
      b = randint(bMin, maxSquare);
    } while (b % (a * a) === 0 || isSquare(b));
    return new SquareRoot(a * a * b);
  }
}

export class SquareRoot extends Real {
  operand: number;
  constructor(operand: number) {
    super(Math.sqrt(operand), `\\sqrt{${operand}}`);
    this.operand = operand;
  }

  simplify(): Real {
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
    const insideSqrt = factors.length === 0 ? 1 : factors.reduce((x, y) => x * y);

    const simplified =
      insideSqrt !== 1
        ? new Real(
            outsideSqrt * Math.sqrt(insideSqrt),
            `${outsideSqrt === 1 ? '' : `${outsideSqrt}`}\\sqrt{${insideSqrt}}`,
          )
        : new Real(outsideSqrt, outsideSqrt + '');
    simplified.toTree = (): Node => {
      return insideSqrt !== 1
        ? outsideSqrt === 1
          ? new SqrtNode(new NumberNode(insideSqrt))
          : new MultiplyNode(new NumberNode(outsideSqrt), new SqrtNode(new NumberNode(insideSqrt)))
        : new NumberNode(outsideSqrt);
    };
    return simplified;
  }

  toTex(): string {
    return this.tex;
  }

  toTree(): Node {
    return new SqrtNode(new NumberNode(this.operand));
  }
}
