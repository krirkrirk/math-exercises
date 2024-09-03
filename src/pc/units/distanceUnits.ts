import { BaseTenUnit } from "./interfaces/baseTenUnit";
import { Unit } from "./interfaces/unit";

export type distanceUnits = "km" | "hm" | "dam" | "m" | "dm" | "cm" | "mm";
const distances = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
export class DistanceUnit extends BaseTenUnit<distanceUnits> {
  getUnitsValues(): string[] {
    return distances;
  }
  getUnitsObjects(): Unit<distanceUnits>[] {
    return [
      DistanceUnit.km,
      DistanceUnit.hm,
      DistanceUnit.dam,
      DistanceUnit.m,
      DistanceUnit.dm,
      DistanceUnit.cm,
      DistanceUnit.mm,
    ];
  }
  static readonly km = new DistanceUnit("km");
  static readonly hm = new DistanceUnit("hm");
  static readonly dam = new DistanceUnit("dam");
  static readonly m = new DistanceUnit("m");
  static readonly dm = new DistanceUnit("dm");
  static readonly cm = new DistanceUnit("cm");
  static readonly mm = new DistanceUnit("mm");

  className(): string {
    return "DistanceUnit";
  }
}
