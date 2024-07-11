import { Unit } from "./unit";

type distanceUnits = "km" | "hm" | "dam" | "m" | "dm" | "cm" | "mm";

export class DistanceUnit implements Unit {
  unit: distanceUnits;

  constructor(unit: distanceUnits) {
    this.unit = unit;
  }

  toTex(): string {
    return `${this.unit}`;
  }
  getUnit(): string {
    return this.unit;
  }
  className(): string {
    return "DistanceUnit";
  }
}
