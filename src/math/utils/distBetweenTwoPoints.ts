import { Point } from "../geometry/point";

export function distBetweenTwoPoints(point1: Point, point2: Point): number {
  const x1 = point1.getXnumber();
  const y1 = point1.getXnumber();
  const x2 = point2.getXnumber();
  const y2 = point2.getYnumber();
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
