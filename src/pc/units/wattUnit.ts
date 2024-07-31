import { BaseTenUnit } from "./baseTenUnit";
import { Unit } from "./unit";

type wattValues = "kW" | "hW" | "daW" | "W" | "dW" | "cW" | "mW";

const wattsUnits: wattValues[] = ["kW", "hW", "daW", "W", "dW", "cW", "mW"];

export class WattUnit extends BaseTenUnit<wattValues> {
  static readonly kW = new WattUnit("kW");
  static readonly hW = new WattUnit("hW");
  static readonly daW = new WattUnit("daW");
  static readonly W = new WattUnit("W");
  static readonly dW = new WattUnit("dW");
  static readonly cW = new WattUnit("cW");
  static readonly mW = new WattUnit("mW");
  className(): string {
    return "WattUnit";
  }
  getUnitsValues(): string[] {
    return wattsUnits;
  }
  getUnitsObjects(): Unit<wattValues>[] {
    return [
      WattUnit.kW,
      WattUnit.hW,
      WattUnit.daW,
      WattUnit.W,
      WattUnit.dW,
      WattUnit.cW,
      WattUnit.mW,
    ];
  }
}
