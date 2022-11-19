import { isSquare } from "../../mathutils/arithmetic/isSquare";
import { primeFactors } from "../../mathutils/arithmetic/primeFactors";
import { randint } from "../../mathutils/random/randint";
import { Real } from "./real";

export abstract class SquareRootConstructor {
  /**
   * @returns simplifiable square root type sqrt(c)=a*sqrt(b)
   */
  randomSimplifiable({ allowPerfectSquare = false, maxSquare = 11 }): SquareRoot {
    const a = randint(2, maxSquare);
    let b;
    let bMin = allowPerfectSquare ? 1 : 2;
    do {
      b = randint(bMin, maxSquare);
    } while (b % (a * a) === 0 || isSquare(b));
    return new SquareRoot(a * a * b);
  }
}

export class SquareRoot implements Real {
  tex: string;

  constructor(operand: string | number) {
    this.tex = `\\sqrt{${operand}}`;
  }

  simplify() {
    const factors = primeFactors(b);

    /**
     * finds primes with even exponents
     */
    const multiples = [1];
    for (let i = 0; i < factors.length - 1; i++) {
      if (factors[i] === factors[i + 1]) {
        multiples.push(factors[i]);
        factors.splice(i, 2); 
      }
    }
  }

  toTex(): string {
    return this.tex;
  }
}

const outsideSqrtB = multiples.reduce((x, y) => x * y); // A should be muliply be all those numbers
const insideSqrtB = factors.length === 0 ? "" : factors.reduce((x, y) => x * y); // here is what remains in the squareroot

if (b === 1) answer = `${a}`;
else if (factors.length === 0) answer = `${a * outsideSqrtB}`;
// if the is no leftover in the squareroot, it just vanish
else answer = `${a * outsideSqrtB}\\sqrt{${insideSqrtB}}`;
