import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { Measure } from "../measure/measure";

export interface Unit<T> {
  getUnit(): string;
  className(): string;
  toTex(): string;
  toTree(): AlgebraicNode;
  convert?(
    significantPart: number,
    exponent: number,
    convertToUnit: T,
  ): Measure<T>;
}
