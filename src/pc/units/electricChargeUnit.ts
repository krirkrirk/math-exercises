import { BaseTenUnit } from "./baseTenUnit";
import { Unit } from "./unit";

type electricChargeValues = "kC" | "hC" | "daC" | "C" | "dC" | "cC" | "mC";

const mass: electricChargeValues[] = ["kC", "hC", "daC", "C", "dC", "cC", "mC"];

export class ElectricChargeUnit extends BaseTenUnit<electricChargeValues> {
  static readonly kC = new ElectricChargeUnit("kC");
  static readonly hC = new ElectricChargeUnit("hC");
  static readonly daC = new ElectricChargeUnit("daC");
  static readonly C = new ElectricChargeUnit("C");
  static readonly dC = new ElectricChargeUnit("dC");
  static readonly cC = new ElectricChargeUnit("cg");
  static readonly mC = new ElectricChargeUnit("mC");

  className(): string {
    return "ElectricChargeUnit";
  }
  getUnitsValues(): string[] {
    return mass;
  }
  getUnitsObjects(): Unit<electricChargeValues>[] {
    return [
      ElectricChargeUnit.kC,
      ElectricChargeUnit.hC,
      ElectricChargeUnit.daC,
      ElectricChargeUnit.C,
      ElectricChargeUnit.dC,
      ElectricChargeUnit.cC,
      ElectricChargeUnit.mC,
    ];
  }
}
