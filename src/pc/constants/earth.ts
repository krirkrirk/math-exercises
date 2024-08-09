import { Measure } from "../measure/measure";
import { DistanceUnit } from "../units/distanceUnits";
import { MassUnit } from "../units/massUnits";

type PhysicalConstant = {
  measure: Measure;
};

export const earthRayon: PhysicalConstant = {
  measure: new Measure(6.38, 3, DistanceUnit.km),
};

export const earthMass: PhysicalConstant = {
  measure: new Measure(5.97, 24, MassUnit.kg),
};
