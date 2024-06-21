import { Measure } from "../measure/measure";

type PhysicalConstant = {
  value: Measure;
  unit: string;
};

export const nucleonMass: PhysicalConstant = {
  value: new Measure(1.67, -27),
  // value: 1.67 * Math.pow(10, -27),
  unit: "\\text{kg}",
};

export const avogadroConstant: PhysicalConstant = {
  value: new Measure(6.02, 23),
  // value: 6.02 * Math.pow(10, 23),
  unit: "\\text{mol^(-1)}",
};
