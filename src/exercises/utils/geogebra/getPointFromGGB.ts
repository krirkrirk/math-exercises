import { Point } from "#root/math/geometry/point";

export function getPointFromGGB(
  command: string,
  name: string,
  isInteger: boolean = true,
): Point {
  const splitted = command.split(";");
  const x = isInteger
    ? +(+splitted[0].replace("(", "")).toFixed(0)
    : +splitted[0].replace("(", "");
  const y = isInteger
    ? +(+splitted[1].replace(")", "")).toFixed(0)
    : +splitted[1].replace(")", "");
  return new Point(name, x.toTree(), y.toTree());
}
