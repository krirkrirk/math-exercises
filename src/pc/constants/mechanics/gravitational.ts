import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { DivideUnits } from "#root/pc/units/divideUnits";
import { ForceUnit } from "#root/pc/units/forceUnits";
import { MassUnit } from "#root/pc/units/massUnits";
import { MultiplyUnit } from "#root/pc/units/mulitplyUnits";
import { Measure } from "../../measure/measure";

type PhysicalConstant = {
  measure: Measure;
  unit: string;
};

export const earthGravity: PhysicalConstant = {
  measure: new Measure(9.80665, 0, new DivideUnits(ForceUnit.N, MassUnit.kg)),
  unit: "\\text{N}\\cdot\\text{kg}^{-1}",
};

export const moonGravity: PhysicalConstant = {
  measure: new Measure(1.622, 0, new DivideUnits(ForceUnit.N, MassUnit.kg)),
  unit: "\\text{N}\\cdot\\text{kg}^{-1}",
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
  unit: "\\text{N}\\cdot\\text{m}^2\\cdot\\text{kg}^{-2}",
};

export const sunMass: PhysicalConstant = {
  measure: new Measure(1.989, 30, MassUnit.kg),
  unit: "\\text{kg}",
};

export const sunRadius: PhysicalConstant = {
  measure: new Measure(6.96342, 8, DistanceUnit.m),
  unit: "\\text{m}",
};

export const sunSurfaceArea: PhysicalConstant = {
  measure: new Measure(
    6.09,
    18,
    new MultiplyUnit(DistanceUnit.m, DistanceUnit.m),
  ),
  unit: "\\text{m}^2",
};

export const sunLuminosity: PhysicalConstant = {
  measure: new Measure(3.828, 26),
  unit: "\\text{W}",
};
