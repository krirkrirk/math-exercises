import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Measure } from "../measure/measure";
import { Unit } from "./unit";

export type massValues = "kg" | "hg" | "dag" | "g" | "dg" | "cg" | "mg";

const mass = ["kg", "hg", "dag", "g", "dg", "cg", "mg"];

export class MassUnit implements Unit {
  static readonly kg = new MassUnit("kg");
  static readonly hg = new MassUnit("hg");
  static readonly dag = new MassUnit("dag");
  static readonly g = new MassUnit("g");
  static readonly dg = new MassUnit("dg");
  static readonly cg = new MassUnit("cg");
  static readonly mg = new MassUnit("mg");

  unit: massValues;

  constructor(unit: massValues) {
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
    const massObjects = [
      MassUnit.kg,
      MassUnit.hg,
      MassUnit.dag,
      MassUnit.g,
      MassUnit.dg,
      MassUnit.cg,
      MassUnit.mg,
    ];
    if (!mass.includes(convertToUnit))
      throw new Error(`${convertToUnit} is not recognized as a unit.`);
    const thisUnitIndex = mass.findIndex((value) => this.unit === value);
    const unitIndex = mass.findIndex((value) => convertToUnit === value);
    const resultIndex = unitIndex - thisUnitIndex;
    return new Measure(
      significantPart,
      exponent + resultIndex,
      massObjects[resultIndex],
    );
  }

  toTex(): string {
    return `\\text{${this.unit}}`;
  }

  getUnit(): string {
    return this.unit;
  }

  className(): string {
    return "MassUnit";
  }
}
