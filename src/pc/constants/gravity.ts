type PhysicalConstant = {
  value: number;
  unit: string;
};

export const earthGravity: PhysicalConstant = {
  value: 9.80665,
  unit: "\\text{N}\\cdot\\text{kg}^{-1}",
};
export const moonGravity: PhysicalConstant = {
  value: 1.622,
  unit: "\\text{N}\\cdot\\text{kg}^{-1}",
};
