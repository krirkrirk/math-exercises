import { MassUnit } from "../units/massUnits";
import { Measure } from "../measure/measure";

type PhysicalConstant = {
  value: Measure;
};

export const nucleonMass: PhysicalConstant = {
  value: new Measure(1.67, -27, MassUnit.kg),
  // value: 1.67 * Math.pow(10, -27),
};
