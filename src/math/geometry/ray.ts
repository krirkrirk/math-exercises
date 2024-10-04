import { ToGGBCommandsProps } from "#root/exercises/utils/geogebra/toGGBCommandsProps";
import { randomSegmentName } from "#root/exercises/utils/geometry/randomSegmentName";
import { Point, PointConstructor } from "./point";

export abstract class RayConstructor {
  static random(name?: string) {
    const names = randomSegmentName();
    const points = PointConstructor.randomDifferent(names.split(""));
    return new Ray(points[0], points[1], name);
  }
}

export class Ray {
  startPoint: Point;
  secondPoint: Point;
  name: string;
  ggbName: string;
  constructor(startPoint: Point, secondPoint: Point, name?: string) {
    this.startPoint = startPoint;
    this.secondPoint = secondPoint;
    this.name = name ?? `[${startPoint.name}${secondPoint.name})`;
    this.ggbName = name ?? `ray_{${startPoint.name}${secondPoint.name}}`;
  }

  toTex() {
    return this.name;
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
      `${this.ggbName}=Ray(${this.startPoint.name},${this.secondPoint.name})`,
      `SetFixed(${this.ggbName},${isFixed ? "true" : "false"})`,
      `ShowLabel(${this.ggbName},${showLabel ? "true" : "false"})`,
    ];
    if (shouldBuildPoints) {
      const ACommands = this.startPoint.toGGBCommand({
        isFixed,
        showLabel: showUnderlyingPointsLabel,
      });
      const BCommands = this.secondPoint.toGGBCommand({
        isFixed,
        showLabel: showUnderlyingPointsLabel,
      });
      commands.unshift(...ACommands, ...BCommands);
    }
    return commands;
  }
}
