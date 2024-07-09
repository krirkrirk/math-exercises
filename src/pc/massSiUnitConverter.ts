import { MassUnit } from "./massUnits";
import { Measure } from "./measure/measure";
import { Unit } from "./unit";
import { UnitConverter } from "./UnitConverter";

export class MassSiUnitConverter implements UnitConverter {
  convert(significantPart: number, exponent: number, unit: Unit): Measure {
    let convertedExpo = exponent;
    switch (unit.getUnit()) {
      case "kg":
        break;
      case "dag":
        convertedExpo = exponent - 1;
        break;
      case "hag":
        convertedExpo = exponent - 2;
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
    return new Measure(
      significantPart,
      convertedExpo,
      new MassUnit("kg"),
      this,
    );
  }
}
