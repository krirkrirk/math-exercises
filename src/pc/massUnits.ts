import { Unit } from "./unit";

type massUnits = "kg" | "hg" | "dag" | "g" | "dc" | "cg" | "mg";

export class MassUnit implements Unit {
  static readonly kg = new MassUnit("kg");

  unit: massUnits;

  constructor(unit: massUnits) {
    this.unit = unit;
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
