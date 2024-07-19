import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Measure } from "../measure/measure";
import { Unit } from "./unit";

export type timeValues = "h" | "mi" | "s" | "ms";

const times = ["h", "mi", "s", "ms"];

export class TimeUnit implements Unit {
  static readonly h = new TimeUnit("h");
  static readonly mi = new TimeUnit("mi");
  static readonly s = new TimeUnit("s");
  static readonly ms = new TimeUnit("ms");

  unit: timeValues;

  constructor(unit: timeValues) {
    this.unit = unit;
  }

  toTree(): AlgebraicNode {
    return new VariableNode(this.unit);
  }

  convert(
    significantPart: number,
    exponent: number,
    convertToUnit: string,
  ): Measure {
    const timeObjects = [TimeUnit.h, TimeUnit.mi, TimeUnit.s, TimeUnit.ms];
    if (!times.includes(convertToUnit))
      throw new Error(`${convertToUnit} is not recognized as a unit.`);
    const thisUnitIndex = times.findIndex((value) => this.unit === value);
    const unitIndex = times.findIndex((value) => convertToUnit === value);
    const resultIndex = unitIndex - thisUnitIndex;
    return new Measure(
      significantPart,
      exponent + resultIndex,
      timeObjects[resultIndex],
    );
  }

  toTex(): string {
    return `\\text{${this.unit}}`;
  }

  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "TimeUnit";
  }
}
