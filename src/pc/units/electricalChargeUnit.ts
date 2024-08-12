import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type electricalChargeValues = "kC" | "hC" | "daC" | "C" | "dC" | "cC" | "mC";

const mass: electricalChargeValues[] = [
  "kC",
  "hC",
  "daC",
  "C",
  "dC",
  "cC",
  "mC",
];

export class ElectricalChargeUnit extends BaseTenUnit<electricalChargeValues> {
  static readonly kC = new ElectricalChargeUnit("kC");
  static readonly hC = new ElectricalChargeUnit("hC");
  static readonly daC = new ElectricalChargeUnit("daC");
  static readonly C = new ElectricalChargeUnit("C");
  static readonly dC = new ElectricalChargeUnit("dC");
  static readonly cC = new ElectricalChargeUnit("cg");
  static readonly mC = new ElectricalChargeUnit("mC");

  className(): string {
    return "ElectricalChargeUnit";
  }
  getUnitsValues(): string[] {
    return mass;
  }
  getUnitsObjects(): Unit<electricalChargeValues>[] {
    return [
      ElectricalChargeUnit.kC,
      ElectricalChargeUnit.hC,
      ElectricalChargeUnit.daC,
      ElectricalChargeUnit.C,
      ElectricalChargeUnit.dC,
      ElectricalChargeUnit.cC,
      ElectricalChargeUnit.mC,
    ];
  }
}
