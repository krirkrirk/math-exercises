import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type PaValues = "kPa" | "hPa" | "daPa" | "Pa" | "dPa" | "cPa" | "mPa";

const paValues: PaValues[] = ["kPa", "hPa", "daPa", "Pa", "dPa", "cPa", "mPa"];

export class PressionUnit extends BaseTenUnit<PaValues> {
  static readonly kPa = new PressionUnit("kPa");
  static readonly hPa = new PressionUnit("hPa");
  static readonly daPa = new PressionUnit("daPa");
  static readonly Pa = new PressionUnit("Pa");
  static readonly dPa = new PressionUnit("dPa");
  static readonly cPa = new PressionUnit("cPa");
  static readonly mPa = new PressionUnit("mPa");

  className(): string {
    return "PressionUnit";
  }
  getUnitsValues(): string[] {
    return paValues;
  }
  getUnitsObjects(): Unit<PaValues>[] {
    return [
      PressionUnit.kPa,
      PressionUnit.hPa,
      PressionUnit.daPa,
      PressionUnit.Pa,
      PressionUnit.dPa,
      PressionUnit.cPa,
      PressionUnit.mPa,
    ];
  }
}
