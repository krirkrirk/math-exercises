import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type volumeValues = "kL" | "hL" | "daL" | "L" | "dL" | "cL" | "mL";

const L: volumeValues[] = ["kL", "hL", "daL", "L", "dL", "cL", "mL"];

export class VolumeUnit extends BaseTenUnit<volumeValues> {
  static readonly kL = new VolumeUnit("kL");
  static readonly hL = new VolumeUnit("hL");
  static readonly daL = new VolumeUnit("daL");
  static readonly L = new VolumeUnit("L");
  static readonly dL = new VolumeUnit("dL");
  static readonly cL = new VolumeUnit("cL");
  static readonly mL = new VolumeUnit("mL");

  className(): string {
    return "VolumeUnit";
  }

  getUnitsValues(): string[] {
    return L;
  }
  getUnitsObjects(): Unit<volumeValues>[] {
    return [
      VolumeUnit.kL,
      VolumeUnit.hL,
      VolumeUnit.daL,
      VolumeUnit.L,
      VolumeUnit.dL,
      VolumeUnit.cL,
      VolumeUnit.mL,
    ];
  }
}
