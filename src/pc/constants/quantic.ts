import { Measure } from "../measure/measure";

type PhysicalConstant = {
  value: Measure;
  unit: string;
};

export const planckConstant: PhysicalConstant = {
  value: new Measure(6.626, -34),
  // value: 6.626 * Math.pow(10, -34),
  unit: "\\text{J.s}",
};

export const lightSpeed: PhysicalConstant = {
  value: new Measure(3, 8),
  // value: 3 * Math.pow(10, 8),
  unit: "\\text{m.s^(-1)}",
};
