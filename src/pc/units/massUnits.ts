import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type massValues = "kg" | "hg" | "dag" | "g" | "dg" | "cg" | "mg";

const mass: massValues[] = ["kg", "hg", "dag", "g", "dg", "cg", "mg"];

export class MassUnit extends BaseTenUnit<massValues> {
  static readonly kg = new MassUnit("kg");
  static readonly hg = new MassUnit("hg");
  static readonly dag = new MassUnit("dag");
  static readonly g = new MassUnit("g");
  static readonly dg = new MassUnit("dg");
  static readonly cg = new MassUnit("cg");
  static readonly mg = new MassUnit("mg");

  className(): string {
    return "MassUnit";
  }
  getUnitsValues(): string[] {
    return mass;
  }
  getUnitsObjects(): Unit<massValues>[] {
    return [
      MassUnit.kg,
      MassUnit.hg,
      MassUnit.dag,
      MassUnit.g,
      MassUnit.dg,
      MassUnit.cg,
      MassUnit.mg,
    ];
  }
}
