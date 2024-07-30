import { Measure } from "../measure/measure";
import { BasicUnit } from "./basicUnit";
import { Unit } from "./unit";

export abstract class BaseTenUnit extends BasicUnit {
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
