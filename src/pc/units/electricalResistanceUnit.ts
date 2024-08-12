import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type ohmValues = "kΩ" | "hΩ" | "daΩ" | "Ω" | "dΩ" | "cΩ" | "mΩ";

const ohmValues: ohmValues[] = ["kΩ", "hΩ", "daΩ", "Ω", "dΩ", "cΩ", "mΩ"];

export class ElectricalResistanceUnit extends BaseTenUnit<ohmValues> {
  static readonly kΩ = new ElectricalResistanceUnit("kΩ");
  static readonly hΩ = new ElectricalResistanceUnit("hΩ");
  static readonly daΩ = new ElectricalResistanceUnit("daΩ");
  static readonly Ω = new ElectricalResistanceUnit("Ω");
  static readonly dΩ = new ElectricalResistanceUnit("dΩ");
  static readonly cΩ = new ElectricalResistanceUnit("cΩ");
  static readonly mΩ = new ElectricalResistanceUnit("mΩ");

  className(): string {
    return "ElectricalResistanceUnit";
  }
  getUnitsValues(): string[] {
    return ohmValues;
  }
  getUnitsObjects(): Unit<ohmValues>[] {
    return [
      ElectricalResistanceUnit.kΩ,
      ElectricalResistanceUnit.hΩ,
      ElectricalResistanceUnit.daΩ,
      ElectricalResistanceUnit.Ω,
      ElectricalResistanceUnit.dΩ,
      ElectricalResistanceUnit.cΩ,
      ElectricalResistanceUnit.mΩ,
    ];
  }
}
