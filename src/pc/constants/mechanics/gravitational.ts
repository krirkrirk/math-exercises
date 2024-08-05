import { Measure } from "../../measure/measure";

type PhysicalConstant = {
  measure: Measure;
  unit: string;
};

export const earthGravity: PhysicalConstant = {
  measure: new Measure(9.80665, 0),
  unit: "\\text{N}\\cdot\\text{kg}^{-1}",
};

export const moonGravity: PhysicalConstant = {
  measure: new Measure(1.622),
  unit: "\\text{N}\\cdot\\text{kg}^{-1}",
};

export const earthG: PhysicalConstant = {
  measure: new Measure(6.67, -11),
  unit: "\\text{N}\\cdot\\text{m}^2\\cdot\\text{kg}^{-2}",
};

export const sunMass: PhysicalConstant = {
  measure: new Measure(1.989, 30),
  unit: "\\text{kg}",
};

export const sunRadius: PhysicalConstant = {
  measure: new Measure(6.96342, 8),
  unit: "\\text{m}",
};

export const sunSurfaceArea: PhysicalConstant = {
  measure: new Measure(6.09, 18),
  unit: "\\text{m}^2",
};

export const sunLuminosity: PhysicalConstant = {
  measure: new Measure(3.828, 26),
  unit: "\\text{W}",
};
