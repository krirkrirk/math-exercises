import { Measure } from "../measure/measure";
import { BasicUnit } from "./basicUnit";
import { Unit } from "./unit";

export abstract class BaseTenUnit<T extends string> extends BasicUnit<T> {
  convert(
    significantPart: number,
    exponent: number,
    convertToUnit: T,
  ): Measure<T> {
    const units = this.getUnitsValues();
    const unitsObject: Unit<T>[] = this.getUnitsObjects();
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
  abstract getUnitsObjects(): Unit<T>[];
}
