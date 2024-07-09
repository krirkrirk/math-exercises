import { Measure } from "./measure/measure";
import { Unit } from "./unit";

export interface UnitConverter {
  convert: (significantPart: number, exponent: number, unit: Unit) => Measure;
}
