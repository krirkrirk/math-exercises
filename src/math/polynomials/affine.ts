import { Nombre } from "../numbers/nombre";
import { Rational } from "../numbers/rationals/rational";
import { randint } from "../utils/random/randint";
import { Polynomial } from "./polynomial";

export abstract class AffineConstructor {
  static random(
    aOpts?: { min?: number; max?: number; excludes?: number[] },
    bOpts?: { min?: number; max?: number; excludes?: number[] },
  ): Affine {
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
    return new Affine(a, b);
  }

  static differentRandoms(
    nb: number,
    aOpts?: { min?: number; max?: number; excludes?: number[] },
    bOpts?: { min?: number; max?: number; excludes?: number[] },
  ): Affine[] {
    const res: Affine[] = [];
    for (let i = 0; i < nb; i++) {
      let aff: Affine;
      do {
        aff = AffineConstructor.random(aOpts, bOpts);
      } while (res.some((affine) => affine.equals(aff)));
      res.push(aff);
    }
    return res;
  }
}

export class Affine extends Polynomial {
  a: number;
  b: number;
  variable: string;

  constructor(a: number, b: number, variable: string = "x") {
    super([b, a], variable);
    this.a = a;
    this.b = b;
    this.variable = variable;
  }

  getRoot(): Nombre {
    return new Rational(-this.b, this.a).simplify();
  }

  toString(): string {
    return super.toTex();
  }
}
