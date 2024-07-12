export interface Unit {
  className: () => string;
  toTex: () => string;
  getUnit: () => string;
  convert?: (unit: string, exponent: number) => number;
}
