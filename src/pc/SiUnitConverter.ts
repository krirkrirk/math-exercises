import { DistanceUnit } from "./distanceUnits";
import { MassUnit } from "./massUnits";
import { Measure } from "./measure/measure";
import { Unit } from "./unit";
import { UnitConverter } from "./UnitConverter";

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
    let convertedExpo = exponent;
    switch (unit.getUnit()) {
      case "kg":
        break;
      case "hg":
        convertedExpo = exponent - 2;
        break;
      case "dag":
        convertedExpo = exponent - 1;
        break;
      case "g":
        convertedExpo = exponent - 3;
        break;
      case "dg":
        convertedExpo = exponent - 4;
        break;
      case "cg":
        convertedExpo = exponent - 5;
        break;
      case "mg":
        convertedExpo = exponent - 6;
        break;
    }
    return new Measure(significantPart, convertedExpo, new MassUnit("kg"));
  }

  convertDistance(
    significantPart: number,
    exponent: number,
    unit: Unit,
  ): Measure {
    let convertedExpo = exponent;
    switch (unit.getUnit()) {
      case "km":
        convertedExpo = exponent + 3;
      case "hm":
        convertedExpo = exponent + 2;
        break;
      case "dam":
        convertedExpo = exponent + 1;
        break;
      case "dm":
        convertedExpo = exponent - 1;
        break;
      case "cm":
        convertedExpo = exponent - 2;
        break;
      case "mm":
        convertedExpo = exponent - 3;
        break;
    }
    return new Measure(significantPart, convertedExpo, new DistanceUnit("m"));
  }
}
