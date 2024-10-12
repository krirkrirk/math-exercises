import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { Node, NodeOptions } from "#root/tree/nodes/node";
import { random } from "#root/utils/alea/random";
import { randint } from "../utils/random/randint";
import { DecimalConstructor } from "./decimals/decimal";
import { Integer } from "./integer/integer";
import { RationalConstructor } from "./rationals/rational";
import { RealConstructor } from "./reals/real";

export enum NumberType {
  Integer,
  Decimal,
  Rational,
  Real,
}

export interface Nombre {
  value: number;
  tex: string;
  type: NumberType;
  toTree: (opts?: NodeOptions) => AlgebraicNode;
  equals: (n: Nombre) => boolean;
}

export abstract class NombreConstructor {
  static random({
    types,
    excludes,
  }: {
    types?: NumberType[];
    excludes?: Nombre[];
  } = {}) {
    const allowedTypes = types ?? [
      NumberType.Integer,
      NumberType.Decimal,
      NumberType.Rational,
      NumberType.Real,
    ];
    const type = random(allowedTypes);
    let res: Nombre;
    switch (type) {
      case NumberType.Integer:
        do {
          res = new Integer(randint(-9, 10));
        } while (excludes?.some((el) => el.equals(res)));
        break;
      case NumberType.Decimal:
        do {
          res = DecimalConstructor.random(-9, 10);
        } while (excludes?.some((el) => el.equals(res)));
        break;
      case NumberType.Rational:
        do {
          res = RationalConstructor.randomIrreductible();
        } while (excludes?.some((el) => el.equals(res)));
        break;
      case NumberType.Real:
        do {
          res = RealConstructor.random();
        } while (excludes?.some((el) => el.equals(res)));
        break;
    }
    return res;
  }
}
