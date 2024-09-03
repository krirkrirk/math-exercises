import { Measure } from "#root/pc/measure/measure";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Unit } from "./unit";

export abstract class BasicUnit<T extends string> implements Unit<T> {
  unit: string;

  constructor(unit: string) {
    this.unit = unit;
  }

  getUnit(): string {
    return this.unit;
  }

  toTex(): string {
    return `\\text{${this.unit}}`;
  }
  toTree(): AlgebraicNode {
    return new VariableNode(this.toTex());
  }
  abstract convert?(
    significantPart: number,
    exponent: number,
    convertToUnit: T,
  ): Measure<T>;
  abstract className(): string;
}
