export interface Unit {
  className: () => string;
  toTex: () => string;
  getUnit: () => string;
}
