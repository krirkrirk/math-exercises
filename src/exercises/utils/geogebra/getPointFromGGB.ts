import { Point } from "#root/math/geometry/point";

export function getPointFromGGB(command: string, name: string): Point {
  const splitted = command.split(";");
  const x = +splitted[0].replace("(", "");
  const y = +splitted[1].replace(")", "");
  return new Point(name, x.toTree(), y.toTree());
}
