import { Unit } from "./unit";

type massUnits = "kg" | "hag" | "dag" | "g" | "dc" | "cg" | "mg";

export class MassUnit implements Unit {
  unit: massUnits;

  constructor(unit: massUnits) {
    this.unit = unit;
  }

  toTex(): string {
    return `${this.unit}`;
  }
  getUnit(): string {
    return this.unit;
  }
  className(): string {
    return "MassUnit";
  }
}
