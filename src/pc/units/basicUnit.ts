import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Measure } from "../measure/measure";
import { Unit } from "./unit";

export abstract class BasicUnit implements Unit {
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
    return new VariableNode(this.unit);
  }

  convert(
    significantPart: number,
    exponent: number,
    convertToUnit: string,
  ): Measure {
    const units = this.getUnitsValues();
    const unitsObject: Unit[] = this.getUnitsObjects();
    if (!units.includes(convertToUnit))
      throw new Error(`cannot convert ${this.toTex()} to ${convertToUnit}.`);
    const thisUnitIndex = units.findIndex((value) => this.unit === value);
    const unitIndex = units.findIndex((value) => convertToUnit === value);
    const resultIndex = unitIndex - thisUnitIndex;
    return new Measure(
      significantPart,
      exponent + resultIndex,
      unitsObject[unitIndex],
    );
  }

  abstract className(): string;
  abstract getUnitsValues(): string[];
  abstract getUnitsObjects(): Unit[];
}
