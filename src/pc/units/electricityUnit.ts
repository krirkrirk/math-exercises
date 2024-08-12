import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type amperValues = "kA" | "hA" | "daA" | "A" | "dA" | "cA" | "mA";

const amperValues: amperValues[] = ["kA", "hA", "daA", "A", "dA", "cA", "mA"];

export class ElectricityUnit extends BaseTenUnit<amperValues> {
  static readonly kA = new ElectricityUnit("kA");
  static readonly hA = new ElectricityUnit("hA");
  static readonly daA = new ElectricityUnit("daA");
  static readonly A = new ElectricityUnit("A");
  static readonly dA = new ElectricityUnit("dA");
  static readonly cA = new ElectricityUnit("cA");
  static readonly mA = new ElectricityUnit("mA");

  className(): string {
    return "ElectricityUnit";
  }
  getUnitsValues(): string[] {
    return amperValues;
  }
  getUnitsObjects(): Unit<amperValues>[] {
    return [
      ElectricityUnit.kA,
      ElectricityUnit.hA,
      ElectricityUnit.daA,
      ElectricityUnit.A,
      ElectricityUnit.dA,
      ElectricityUnit.cA,
      ElectricityUnit.mA,
    ];
  }
}
