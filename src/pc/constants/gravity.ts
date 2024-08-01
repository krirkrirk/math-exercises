import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { Measure } from "../measure/measure";
import { DistanceUnit } from "../units/distanceUnits";
import { DivideUnit } from "../units/divideUnit";
import { ForceUnit } from "../units/forceUnits";
import { MassUnit } from "../units/massUnits";
import { MultiplyUnit } from "../units/mulitplyUnits";

type PhysicalConstant = {
  measure: Measure;
};

const two = new NumberNode(2);

export const earthGravity: PhysicalConstant = {
  measure: new Measure(9.80665, 0, new DivideUnit(ForceUnit.N, MassUnit.kg)),
};
export const moonGravity: PhysicalConstant = {
  measure: new Measure(1.622, 0, new DivideUnit(ForceUnit.N, MassUnit.kg)),
};
export const earthG: PhysicalConstant = {
  measure: new Measure(
    6.67,
    -11,
    new DivideUnit(
      new MultiplyUnit(
        ForceUnit.N,
        new MultiplyUnit(DistanceUnit.m, DistanceUnit.m),
      ),
      new MultiplyUnit(MassUnit.kg, MassUnit.kg),
    ),
  ),
};
