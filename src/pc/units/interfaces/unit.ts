import { Measure } from "#root/pc/measure/measure";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";

export interface Unit<T extends string> {
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
