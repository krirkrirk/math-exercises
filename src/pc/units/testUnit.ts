import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Measure } from "../measure/measure";

export abstract class TestUnit {
  unit: string;

  constructor(unit: string) {
    this.unit = unit;
  }

  convert(
    significantPart: number,
    exponent: number,
    convertToUnit: string,
  ): Measure {
    const units = this.getUnitsValues();
    const unitsObject = this.getUnitsObjects();
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

  abstract getUnitsValues(): string[];
  abstract getUnitsObjects(): TestUnit[];
  getUnit(): string {
    return this.unit;
  }
  abstract toTex(): string;
}
