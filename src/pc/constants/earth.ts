import { Measure } from "../measure/measure";

type PhysicalConstant = {
  measure: Measure;
  unit: string;
};

export const earthRayon: PhysicalConstant = {
  measure: new Measure(6.38, 3),
  unit: "\\text{km}",
};

export const earthMass: PhysicalConstant = {
  measure: new Measure(5.97, 24),
  unit: "\\text{kg}",
};
