import { DistanceUnit } from "./units/distanceUnits";
import { MassUnit } from "./units/massUnits";
import { Measure } from "./measure/measure";
import { Unit } from "./units/unit";
import { UnitConverter } from "./UnitConverter";

const mass = ["kg", "hg", "dag", "g", "dg", "cg", "mg"];
const distances = ["km", "hm", "dam", "m", "dm", "cm", "mm"];

export class SiUnitConverter implements UnitConverter {
  convert(significantPart: number, exponent: number, unit: Unit): Measure {
    switch (unit.className()) {
      case "MassUnit":
        return this.convertMass(significantPart, exponent, unit);

      case "DistanceUnit":
        return this.convertDistance(significantPart, exponent, unit);
    }
    throw new Error(`Conversion for ${unit.className()} is not implemented.`);
  }

  convertMass(significantPart: number, exponent: number, unit: Unit): Measure {
    const thisUnitIndex = mass.findIndex((value) => unit.getUnit() === value);
    const SiUnitIndex = 0;
    const convertedExpo = exponent + (SiUnitIndex - thisUnitIndex);
    return new Measure(significantPart, convertedExpo, MassUnit.kg);
  }

  convertDistance(
    significantPart: number,
    exponent: number,
    unit: Unit,
  ): Measure {
    const thisUnitIndex = distances.findIndex(
      (value) => unit.getUnit() === value,
    );
    const SiUnitIndex = 3;
    const convertedExpo = exponent + (SiUnitIndex - thisUnitIndex);
    return new Measure(significantPart, convertedExpo, DistanceUnit.m);
  }
}
