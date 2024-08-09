import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

type frequenceValues = "kHz" | "hHz" | "daHz" | "Hz" | "dHz" | "cHz" | "mHz";

const hzValues: frequenceValues[] = [
  "kHz",
  "hHz",
  "daHz",
  "Hz",
  "dHz",
  "cHz",
  "mHz",
];

export class FrequenceUnit extends BaseTenUnit<frequenceValues> {
  static readonly kHz = new FrequenceUnit("kHz");
  static readonly hHZ = new FrequenceUnit("hHz");
  static readonly daHz = new FrequenceUnit("daHz");
  static readonly Hz = new FrequenceUnit("Hz");
  static readonly dHz = new FrequenceUnit("dHz");
  static readonly cHz = new FrequenceUnit("cHz");
  static readonly mHz = new FrequenceUnit("mHz");

  className(): string {
    return "PressionUnit";
  }
  getUnitsValues(): string[] {
    return hzValues;
  }
  getUnitsObjects(): Unit<frequenceValues>[] {
    return [
      FrequenceUnit.kHz,
      FrequenceUnit.hHZ,
      FrequenceUnit.daHz,
      FrequenceUnit.Hz,
      FrequenceUnit.dHz,
      FrequenceUnit.cHz,
      FrequenceUnit.mHz,
    ];
  }
}
