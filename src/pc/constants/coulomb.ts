import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { Measure } from "../measure/measure";
import { DistanceUnit } from "../units/distanceUnits";
import { DivideUnit } from "../units/divideUnit";
import { ElectricChargeUnit } from "../units/electricChargeUnit";
import { ForceUnit } from "../units/forceUnits";
import { MultiplyUnit } from "../units/mulitplyUnits";
import { PowerUnit } from "../units/powerUnits";

const two = new NumberNode(2);

export const coulombConstant = new Measure(
  8.99,
  9,
  new DivideUnit(
    new MultiplyUnit(ForceUnit.N, new PowerUnit(DistanceUnit.m, two)),
    new PowerUnit(ElectricChargeUnit.C, two),
  ),
);
