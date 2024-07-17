import { Measure } from "../measure/measure";
import { DistanceUnit } from "../units/distanceUnits";
import { DivideUnits } from "../units/divideUnits";
import { ForceUnit } from "../units/forceUnits";
import { MassUnit } from "../units/massUnits";
import { MultiplyUnit } from "../units/mulitplyUnits";

type PhysicalConstant = {
  measure: Measure;
};

export const earthGravity: PhysicalConstant = {
  measure: new Measure(9.80665, 0, new DivideUnits(ForceUnit.N, MassUnit.kg)),
};
export const moonGravity: PhysicalConstant = {
  measure: new Measure(1.622, 0, new DivideUnits(ForceUnit.N, MassUnit.kg)),
};
export const earthG: PhysicalConstant = {
  measure: new Measure(
    6.67,
    -11,
    new DivideUnits(
      new MultiplyUnit(
        ForceUnit.N,
        new MultiplyUnit(DistanceUnit.m, DistanceUnit.m),
      ),
      new MultiplyUnit(MassUnit.kg, MassUnit.kg),
    ),
  ),
};
