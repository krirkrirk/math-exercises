import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type amperValues = "kA" | "hA" | "daA" | "A" | "dA" | "cA" | "mA";

const amperValues: amperValues[] = ["kA", "hA", "daA", "A", "dA", "cA", "mA"];

export class ElectricalUnit extends BaseTenUnit<amperValues> {
  static readonly kA = new ElectricalUnit("kA");
  static readonly hA = new ElectricalUnit("hA");
  static readonly daA = new ElectricalUnit("daA");
  static readonly A = new ElectricalUnit("A");
  static readonly dA = new ElectricalUnit("dA");
  static readonly cA = new ElectricalUnit("cA");
  static readonly mA = new ElectricalUnit("mA");

  className(): string {
    return "ElectricalUnit";
  }
  getUnitsValues(): string[] {
    return amperValues;
  }
  getUnitsObjects(): Unit<amperValues>[] {
    return [
      ElectricalUnit.kA,
      ElectricalUnit.hA,
      ElectricalUnit.daA,
      ElectricalUnit.A,
      ElectricalUnit.dA,
      ElectricalUnit.cA,
      ElectricalUnit.mA,
    ];
  }
}
