import { EPSILON } from "../numbers/epsilon";

export function round(
  x: number,
  precision: number,
  fillDecimals?: boolean,
): number {
  return (
    Math.round((x + EPSILON) * Math.pow(10, precision)) /
    Math.pow(10, precision)
  );
}

export function roundSignificant(x: number, precision: number) {
  const rounded =
    Math.round((x + EPSILON) * Math.pow(10, precision)) /
    Math.pow(10, precision);
  return rounded.toFixed(precision).replace(".", ",");
}
