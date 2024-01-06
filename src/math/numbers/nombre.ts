import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { Node, NodeOptions } from "#root/tree/nodes/node";
import { random } from "#root/utils/random";
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
}

export abstract class NombreConstructor {
  static random() {
    const type = random([
      NumberType.Integer,
      NumberType.Decimal,
      NumberType.Rational,
      NumberType.Real,
    ]);
    switch (type) {
      case NumberType.Integer:
        return new Integer(randint(-9, 10));
      case NumberType.Decimal:
        return DecimalConstructor.random(-9, 10);
      case NumberType.Rational:
        return RationalConstructor.randomIrreductible();
      case NumberType.Real:
        return RealConstructor.random();
    }
  }
}
