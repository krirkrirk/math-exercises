import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Measure } from "../measure/measure";

export abstract class Unit {
  unit: string;

  constructor(unit: string) {
    this.unit = unit;
  }

  getUnit(): string {
    return this.unit;
  }

  abstract className(): string;
  abstract toTex(): string;
  abstract toTree(): AlgebraicNode;
  abstract convert?(
    significantPart: number,
    exponent: number,
    convertToUnit: string,
  ): Measure;
}
