import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { Measure } from "../measure/measure";

export interface Unit {
  className: () => string;
  toTex: () => string;
  getUnit: () => string;
  toTree: () => AlgebraicNode;
  convert?: (
    significantPart: number,
    exponent: number,
    convertToUnit: string,
  ) => Measure;
}

export const getUnitExp = (unit: Unit): number => {
  const splittedUnit = unit.getUnit().split("^");
  const exp: number = unit.getUnit().includes("^")
    ? +splittedUnit[1].replaceAll("{", "").replaceAll("}", "")
    : 1;
  return exp;
};
