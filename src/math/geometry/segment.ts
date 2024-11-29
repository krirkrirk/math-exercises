import { ToGGBCommandsProps } from "#root/exercises/utils/geogebra/toGGBCommandsProps";
import { randomSegmentName } from "#root/exercises/utils/geometry/randomSegmentName";
import { Point, PointConstructor, PointIdentifiers } from "./point";

export type SegmentIdentifiers = {
  pointA: PointIdentifiers;
  pointB: PointIdentifiers;
};
export abstract class SegmentConstructor {
  static random() {
    const name = randomSegmentName();
    const points = PointConstructor.randomDifferent(name.split(""));
    return new Segment(points[0], points[1]);
  }
  static fromIdentifiers(identifiers: SegmentIdentifiers) {
    return new Segment(
      PointConstructor.fromIdentifiers(identifiers.pointA),
      PointConstructor.fromIdentifiers(identifiers.pointB),
    );
  }
}
export class Segment {
  pointA: Point;
  pointB: Point;
  name: string;
  ggbName: string;
  constructor(pointA: Point, pointB: Point) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.name = `[${pointA.name}${pointB.name}]`;
    this.ggbName = `segment_{${pointA.name}${pointB.name}}`;
  }

  toIdentifiers() {
    return {
      pointA: this.pointA.toIdentifiers(),
      pointB: this.pointB.toIdentifiers(),
    };
  }
  getLength() {
    return this.pointA.distanceTo(this.pointB);
  }
  toTex() {
    return this.name;
  }
  toInsideName() {
    return `${this.pointA.name}${this.pointB.name}`;
  }
  toGGBCommands(
    shouldBuildPoints: boolean,
    {
      isFixed = true,
      showLabel = false,
      showUnderlyingPointsLabel = true,
    }: ToGGBCommandsProps = {},
  ) {
    const commands = [
      `${this.ggbName}=Segment(${this.pointA.name},${this.pointB.name})`,
      `SetFixed(${this.ggbName},${isFixed ? "true" : "false"})`,
      `ShowLabel(${this.ggbName},${showLabel ? "true" : "false"})`,
    ];
    if (shouldBuildPoints) {
      const ACommands = this.pointA.toGGBCommand({
        isFixed,
        showLabel: showUnderlyingPointsLabel,
      });
      const BCommands = this.pointB.toGGBCommand({
        isFixed,
        showLabel: showUnderlyingPointsLabel,
      });
      commands.unshift(...ACommands, ...BCommands);
    }
    return commands;
  }
}
