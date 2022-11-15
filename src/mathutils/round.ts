import { EPSILON } from "../numbers/epsilon";

export function round(x: number, precision: number): number {
  return Math.round((x + EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision);
}
