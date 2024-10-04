import { NodeIds, NodeType } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

import { Rational } from "../numbers/rationals/rational";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { Vector, VectorConstructor } from "./vector";
import { randint } from "../utils/random/randint";
import { ToGGBCommandsProps } from "#root/exercises/utils/geogebra/toGGBCommandsProps";

export abstract class PointConstructor {
  static random(name: string): Point {
    const x = randint(-10, 11);
    const y = randint(-10, 11);
    return new Point(name, new NumberNode(x), new NumberNode(y));
  }

  static randomDifferent(names: string[]) {
    const res: Point[] = [];
    const points: number[][] = [];
    for (let i = 0; i < names.length; i++) {
      let x: number;
      let y: number;
      do {
        x = randint(-10, 11);
        y = randint(-10, 11);
      } while (points.some((point) => point[0] === x && point[1] === y));
      points.push([x, y]);
      res.push(new Point(names[i], new NumberNode(x), new NumberNode(y)));
    }
    return res;
  }
  static fromGGBCommand(str: string) {
    const formatted = str.replace(" ", "");
    const name = formatted.split("=")[0];
    const [x, y] = formatted
      .split("=")[1]
      .replace("(", "")
      .replace(")", "")
      .split(",");
    return new Point(
      name,
      new NumberNode(Number(x)),
      new NumberNode(Number(y)),
    );
  }
}

export class Point {
  name: string;
  x: AlgebraicNode;
  y: AlgebraicNode;
  constructor(name: string, x: AlgebraicNode, y: AlgebraicNode) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  toTex(): string {
    return `${this.name}`;
  }
  toIdentifiers() {
    return {
      id: "point",
      name: this.name,
      x: this.x.toIdentifiers(),
      y: this.y.toIdentifiers(),
    };
  }
  toTexWithCoords(): string {
    return `${this.name}\\left(${this.x.toTex()};${this.y.toTex()}\\right)`;
  }
  toCoords(): string {
    return `\\left(${this.x.toTex()};${this.y.toTex()}\\right)`;
  }

  getXnumber(): number {
    if (this.x.type !== NodeType.number)
      throw Error("general point not implemented yet");
    return (this.x as NumberNode).value;
  }

  getYnumber(): number {
    if (this.y.type !== NodeType.number)
      throw Error("general point not implemented yet");
    return (this.y as NumberNode).value;
  }

  midpoint(B: Point, name = "I"): Point {
    const types = [this.x.type, this.y.type, B.x.type, B.y.type];
    if (types.some((type) => type !== NodeType.number)) {
      throw Error("general midpoint not implemented yet");
    }
    return new Point(
      name,
      new Rational((this.x as NumberNode).value + (B.x as NumberNode).value, 2)
        .simplify()
        .toTree(),

      new Rational((this.y as NumberNode).value + (B.y as NumberNode).value, 2)
        .simplify()
        .toTree(),
    );
  }

  distanceTo(B: Point): number {
    const dx = this.getXnumber() - B.getXnumber();
    const dy = this.getYnumber() - B.getYnumber();
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  equals(B: Point): boolean {
    return this.x.equals(B.x) && this.y.equals(B.y);
  }
  isAligned(B: Point, C: Point) {
    const AB = VectorConstructor.fromPoints(this, B);
    const AC = VectorConstructor.fromPoints(this, C);
    return AB.isColinear(AC);
  }

  toGGBCommand({ isFixed = true, showLabel = true }: ToGGBCommandsProps = {}) {
    return [
      `${this.name} = (${this.x.toMathString()}, ${this.y.toMathString()})`,
      `SetFixed(${this.name},${isFixed ? "true" : "false"})`,
      `ShowLabel(${this.name},${showLabel ? "true" : "false"})`,
    ];
  }
}
