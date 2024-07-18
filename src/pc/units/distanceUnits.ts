import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Unit } from "./unit";

export type distanceUnits = "km" | "hm" | "dam" | "m" | "dm" | "cm" | "mm";
const distances = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
export class DistanceUnit implements Unit {
  static readonly km = new DistanceUnit("km");
  static readonly hm = new DistanceUnit("hm");
  static readonly dam = new DistanceUnit("dam");
  static readonly m = new DistanceUnit("m");
  static readonly dm = new DistanceUnit("dm");
  static readonly cm = new DistanceUnit("cm");
  static readonly mm = new DistanceUnit("mm");

  unit: distanceUnits;

  constructor(unit: distanceUnits) {
    this.unit = unit;
  }

  toTree(): AlgebraicNode {
    return new VariableNode(this.unit);
  }

  toTex(): string {
    return `\\text{${this.unit}}`;
  }
  getUnit(): string {
    return this.unit;
  }
  className(): string {
    return "DistanceUnit";
  }
  convert(unit: string): number {
    if (!distances.includes(unit))
      throw new Error(`${unit} is not recognized as a unit.`);
    const thisUnitIndex = distances.findIndex((value) => this.unit === value);
    const unitIndex = distances.findIndex((value) => unit === value);
    return unitIndex - thisUnitIndex;
  }
}
