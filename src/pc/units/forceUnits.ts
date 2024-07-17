import { Unit } from "./unit";

export type forceValues = "kN" | "hN" | "daN" | "N" | "dN" | "cN" | "mN";
const forces = ["kN", "hN", "daN", "N", "dN", "cN", "mN"];

export class ForceUnit implements Unit {
  static readonly kN = new ForceUnit("kN");
  static readonly hN = new ForceUnit("hN");
  static readonly daN = new ForceUnit("daN");
  static readonly N = new ForceUnit("N");
  static readonly dN = new ForceUnit("dN");
  static readonly cN = new ForceUnit("cN");
  static readonly mN = new ForceUnit("mN");

  unit: forceValues;

  constructor(unit: forceValues) {
    this.unit = unit;
  }

  className(): string {
    return "ForceUnit";
  }

  toTex(): string {
    return `\\text{${this.unit}}`;
  }

  getUnit(): string {
    return this.unit;
  }

  convert(unit: string): number {
    if (!forces.includes(unit))
      throw new Error(`${unit} is not recognized as a unit.`);
    const thisUnitIndex = forces.findIndex((value) => this.unit === value);
    const unitIndex = forces.findIndex((value) => unit === value);
    return unitIndex - thisUnitIndex;
  }
}
