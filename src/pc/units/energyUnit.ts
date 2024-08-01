import { Unit } from "./unit";
import { BaseTenUnit } from "./baseTenUnit";

export type energyValues = "kJ" | "hJ" | "daJ" | "J" | "dJ" | "cJ" | "mJ";
const energys = ["kJ", "hJ", "daJ", "J", "dJ", "cJ", "mJ"];

export class EnergyUnit extends BaseTenUnit<energyValues> {
  static readonly kJ = new EnergyUnit("kJ");
  static readonly hJ = new EnergyUnit("hJ");
  static readonly daJ = new EnergyUnit("daJ");
  static readonly J = new EnergyUnit("J");
  static readonly dJ = new EnergyUnit("dJ");
  static readonly cJ = new EnergyUnit("cJ");
  static readonly mJ = new EnergyUnit("mJ");

  className(): string {
    return "EnergyUnit";
  }

  getUnitsValues(): string[] {
    return energys;
  }
  getUnitsObjects(): Unit<energyValues>[] {
    return [
      EnergyUnit.kJ,
      EnergyUnit.hJ,
      EnergyUnit.daJ,
      EnergyUnit.J,
      EnergyUnit.dJ,
      EnergyUnit.cJ,
      EnergyUnit.mJ,
    ];
  }
}
