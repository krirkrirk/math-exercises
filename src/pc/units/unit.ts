export interface Unit {
  className: () => string;
  toTex: () => string;
  getUnit: () => string;
  convert?: (unit: string) => number;
}

export const getUnitExp = (unit: Unit): number => {
  const splittedUnit = unit.getUnit().split("^");
  const exp: number = unit.getUnit().includes("^")
    ? +splittedUnit[1].replaceAll("{", "").replaceAll("}", "")
    : 1;
  return exp;
};
