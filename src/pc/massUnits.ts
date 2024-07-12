import { Unit } from "./unit";

export type massValues = "kg" | "hg" | "dag" | "g" | "dg" | "cg" | "mg";

export class MassUnit implements Unit {
  static readonly kg = new MassUnit("kg");
  static readonly hg = new MassUnit("hg");
  static readonly dag = new MassUnit("dag");
  static readonly g = new MassUnit("g");
  static readonly dg = new MassUnit("dg");
  static readonly cg = new MassUnit("cg");

  unit: massValues;

  constructor(unit: massValues) {
    this.unit = unit;
  }

  convert(unit: string, exponent: number): number {
    return exponent;
  }

  toTex(): string {
    return `\\text{${this.unit}}`;
  }
  getUnit<massValues>(): massValues {
    return this.unit as massValues;
  }
  className(): string {
    return "MassUnit";
  }
}
