import { Measure } from "../../measure/measure";

type PhysicalConstant = {
  measure: Measure;
  unit: string;
};

export const lightSpeed: PhysicalConstant = {
  measure: new Measure(3, 8),
  unit: "\\text{m}\\cdot\\text{s}^{-1}",
};
