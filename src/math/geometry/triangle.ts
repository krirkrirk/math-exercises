import { Point, PointConstructor, PointIdentifiers } from "./point";
import {
  SubstractNode,
  substract,
} from "#root/tree/nodes/operators/substractNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { randint } from "../utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { randomLetter } from "#root/utils/strings/randomLetter";
import { Segment } from "./segment";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";

export type TriangleIdentifiers = {
  vertexA: PointIdentifiers;
  vertexB: PointIdentifiers;
  vertexC: PointIdentifiers;
};
export abstract class TriangleConstructor {
  static fromIdentifiers(identifiers: TriangleIdentifiers): Triangle {
    return new Triangle(
      PointConstructor.fromIdentifiers(identifiers.vertexA),
      PointConstructor.fromIdentifiers(identifiers.vertexB),
      PointConstructor.fromIdentifiers(identifiers.vertexC),
    );
  }
  static createRandomRightTriangle({
    minRapport = 0,
    maxRapport = 5,
    names = ["A", "B", "C"],
  }): Triangle {
    let pointA, pointB, pointC, d1: number, d2: number;
    do {
      const xA = randint(-10, 11);
      const yA = randint(-10, 11);
      const xB = randint(-10, 11);
      const yB = randint(-10, 11);
      pointA = new Point(names[0], new NumberNode(xA), new NumberNode(yA));
      pointB = new Point(names[1], new NumberNode(xB), new NumberNode(yB));
      d1 = pointA.distanceTo(pointB);
      const xC = randint(-11, 10);
      const yC = yA - ((xB - xA) * (xC - xA)) / (yB - yA);
      pointC = new Point(names[2], new NumberNode(xC), new NumberNode(yC));
      d2 = pointA.distanceTo(pointC);
    } while (!d1 || !d2 || d1 / d2 < minRapport || d1 / d2 > maxRapport);
    return new Triangle(pointA, pointB, pointC);
  }

  static createRandomTriangle({
    minAngle = 0.69,
    maxAngle = 1.5,
    names = ["A", "B", "C"],
  }): Triangle {
    let pointA, pointB, pointC, triangle;
    do {
      pointA = new Point(
        names[0],
        new NumberNode(randint(-10, 11)),
        new NumberNode(randint(-10, 11)),
      );
      pointB = new Point(
        names[1],
        new NumberNode(randint(-10, 11)),
        new NumberNode(randint(-10, 11)),
      );
      pointC = new Point(
        names[2],
        new NumberNode(randint(-10, 11)),
        new NumberNode(randint(-10, 11)),
      );
      triangle = new Triangle(pointA, pointB, pointC);
    } while (
      triangle.isRight() ||
      //to prevent aligned
      //shouldnt be done this way
      substract(
        multiply(substract(pointB.x, pointA.x), substract(pointC.y, pointA.y)),
        multiply(substract(pointC.x, pointA.x), substract(pointB.y, pointA.y)),
      ).evaluate() === 0 ||
      //xb-xa * yc-ya = xc-xa * yb-ya
      pointA.distanceTo(pointB) === 0 ||
      pointB.distanceTo(pointC) === 0 ||
      pointC.distanceTo(pointA) === 0 ||
      triangle.getAngleA() < minAngle ||
      triangle.getAngleA() > maxAngle ||
      triangle.getAngleB() < minAngle ||
      triangle.getAngleB() > maxAngle
    );
    return new Triangle(pointA, pointB, pointC);
  }
  static randomName() {
    const startVertix = randomLetter(true, ["Y", "Z"]);
    return [
      startVertix,
      String.fromCharCode(startVertix.charCodeAt(0) + 1),
      String.fromCharCode(startVertix.charCodeAt(0) + 2),
    ];
  }
}

type GenerateCommandsProps = {
  highlightedAngle?: string;
  colorHighlightedAngle?: string;
  highlightedSide?: string;
  colorHighlightedSide?: string;
  showLabels?: string[];
  setCaptions?: string[];
  showAxes?: boolean;
  showGrid?: boolean;
};

export class Triangle {
  vertexA: Point;
  vertexB: Point;
  vertexC: Point;

  constructor(vertexA: Point, vertexB: Point, vertexC: Point) {
    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.vertexC = vertexC;
  }
  getSegments() {
    return [
      this.getSideASegment(),
      this.getSideBSegment(),
      this.getSideCSegment(),
    ];
  }
  getSideASegment() {
    return new Segment(this.vertexB, this.vertexC);
  }
  getSideBSegment() {
    return new Segment(this.vertexA, this.vertexC);
  }
  getSideCSegment() {
    return new Segment(this.vertexA, this.vertexB);
  }
  toIdentifiers(): TriangleIdentifiers {
    return {
      vertexA: this.vertexA.toIdentifiers(),
      vertexB: this.vertexB.toIdentifiers(),
      vertexC: this.vertexC.toIdentifiers(),
    };
  }

  getSideAnumber(): number {
    return Math.hypot(
      this.vertexC.getXnumber() - this.vertexB.getXnumber(),
      this.vertexC.getYnumber() - this.vertexB.getYnumber(),
    );
  }

  getSideBnumber(): number {
    return Math.hypot(
      this.vertexA.getXnumber() - this.vertexC.getXnumber(),
      this.vertexA.getYnumber() - this.vertexC.getYnumber(),
    );
  }

  getSideCnumber(): number {
    return this.vertexA.distanceTo(this.vertexB);
  }

  getTriangleName(): string {
    return this.vertexA.name + this.vertexB.name + this.vertexC.name;
  }

  getSideAnode() {
    return new SqrtNode(
      new AddNode(
        new PowerNode(
          new SubstractNode(this.vertexC.x, this.vertexB.x),
          new NumberNode(2),
        ),
        new PowerNode(
          new SubstractNode(this.vertexC.y, this.vertexB.y),
          new NumberNode(2),
        ),
      ),
    );
  }

  getSideBnode() {
    return new SqrtNode(
      new AddNode(
        new PowerNode(
          new SubstractNode(this.vertexC.x, this.vertexA.x),
          new NumberNode(2),
        ),
        new PowerNode(
          new SubstractNode(this.vertexC.y, this.vertexA.y),
          new NumberNode(2),
        ),
      ),
    );
  }

  getSideCnode() {
    return new SqrtNode(
      new AddNode(
        new PowerNode(
          new SubstractNode(this.vertexA.x, this.vertexB.x),
          new NumberNode(2),
        ),
        new PowerNode(
          new SubstractNode(this.vertexC.y, this.vertexB.y),
          new NumberNode(2),
        ),
      ),
    );
  }

  getAngleA(): number {
    return Math.acos(
      (this.getSideBnumber() ** 2 +
        this.getSideCnumber() ** 2 -
        this.getSideAnumber() ** 2) /
        (2 * this.getSideBnumber() * this.getSideCnumber()),
    );
  }

  getAngleB(): number {
    return Math.acos(
      (this.getSideAnumber() ** 2 +
        this.getSideCnumber() ** 2 -
        this.getSideBnumber() ** 2) /
        (2 * this.getSideAnumber() * this.getSideCnumber()),
    );
  }

  getAngleC(): number {
    return Math.acos(
      (this.getSideAnumber() ** 2 +
        this.getSideBnumber() ** 2 -
        this.getSideCnumber() ** 2) /
        (2 * this.getSideAnumber() * this.getSideBnumber()),
    );
  }

  getPerimeter(): number {
    return (
      this.getSideAnumber() + this.getSideBnumber() + this.getSideCnumber()
    );
  }

  getArea(): number {
    const s = this.getPerimeter() / 2;
    return Math.sqrt(
      s *
        (s - this.getSideAnumber()) *
        (s - this.getSideBnumber()) *
        (s - this.getSideCnumber()),
    );
  }

  isRight(): Boolean {
    if (Math.abs(Math.cos(this.getAngleA())) < 0.001) return true;
    if (Math.abs(Math.cos(this.getAngleB())) < 0.001) return true;
    if (Math.abs(Math.cos(this.getAngleC())) < 0.001) return true;
    return false;
  }

  isEquilateral(): Boolean {
    return (
      this.getSideAnumber() === this.getSideBnumber() &&
      this.getSideAnumber() === this.getSideCnumber()
    );
  }

  isIsosceles(): Boolean {
    return (
      this.getSideAnumber() === this.getSideBnumber() ||
      this.getSideAnumber() === this.getSideCnumber() ||
      this.getSideBnumber() === this.getSideCnumber()
    );
  }

  isScalene(): boolean {
    return (
      this.getSideAnumber() !== this.getSideBnumber() &&
      this.getSideBnumber() !== this.getSideCnumber() &&
      this.getSideCnumber() !== this.getSideAnumber()
    );
  }

  getRightAngle(): string {
    if (Math.abs(Math.cos(this.getAngleA())) < 0.001) return this.vertexA.name;
    if (Math.abs(Math.cos(this.getAngleB())) < 0.001) return this.vertexB.name;
    if (Math.abs(Math.cos(this.getAngleC())) < 0.001) return this.vertexC.name;
    return "";
  }

  generateCommands({
    highlightedAngle: highlightedAngle,
    colorHighlightedAngle: colorHighlightedAngle,
    showLabels: showLabels,
    setCaptions: setCaptions,
    highlightedSide: highlightedSide,
    colorHighlightedSide: colorHighlightedSide,
  }: GenerateCommandsProps): string[] {
    let commands = [
      `${
        this.vertexA.name
      } = Point({${this.vertexA.getXnumber()}, ${this.vertexA.getYnumber()}})`,
      `${
        this.vertexB.name
      } = Point({${this.vertexB.getXnumber()}, ${this.vertexB.getYnumber()}})`,
      `${
        this.vertexC.name
      } = Point({${this.vertexC.getXnumber()}, ${this.vertexC.getYnumber()}})`,
      `ShowLabel(${this.vertexA.name}, true)`,
      `ShowLabel(${this.vertexB.name}, true)`,
      `ShowLabel(${this.vertexC.name}, true)`,
      `${this.getSideCName()} = Segment(${this.vertexA.name}, ${
        this.vertexB.name
      })`,
      `${this.getSideBName()} = Segment(${this.vertexA.name}, ${
        this.vertexC.name
      })`,
      `${this.getSideAName()} = Segment(${this.vertexC.name}, ${
        this.vertexB.name
      })`,
      `ShowLabel(${this.getSideCName()}, false)`,
      `ShowLabel(${this.getSideBName()}, false)`,
      `ShowLabel(${this.getSideBName()}, false)`,
    ];

    if (this.isRight())
      commands.push(
        `alpha = Angle(${this.vertexB.name},${this.vertexA.name},${this.vertexC.name}, Line(${this.vertexB.name},${this.vertexA.name}))`,
        `ShowLabel(alpha, false)`,
      );

    const defautColor = "Red";

    if (highlightedAngle) {
      let temp = [""];
      if (highlightedAngle === this.vertexB.name)
        temp = [this.vertexA.name, this.vertexB.name, this.vertexC.name];
      if (highlightedAngle === this.vertexC.name)
        temp = [this.vertexB.name, this.vertexC.name, this.vertexA.name];
      if (highlightedAngle === this.vertexA.name)
        temp = [this.vertexC.name, this.vertexA.name, this.vertexB.name];

      commands.push(
        `be = Angle(${temp[0]}, ${temp[1]}, ${temp[2]}, Line(${temp[0]}, ${temp[1]}))`,
        `ShowLabel(be, false)`,
        `SetColor(be, "${colorHighlightedAngle ?? defautColor}")`,
      );
    }

    if (showLabels)
      for (let i = 0; i < showLabels.length; i++) {
        commands.push(`ShowLabel(${showLabels[i]}, true)`);
        if (setCaptions)
          commands.push(`SetCaption(${showLabels[i]}, "${setCaptions[i]}")`);
      }
    if (highlightedSide)
      commands.push(
        `SetColor(${highlightedSide}, "${
          colorHighlightedSide ?? defautColor
        }")`,
      );

    return commands;
  }

  generateCoords(): number[] {
    return [
      Math.min(
        this.vertexA.getXnumber(),
        this.vertexB.getXnumber(),
        this.vertexC.getXnumber(),
      ) - 1,
      Math.max(
        this.vertexA.getXnumber(),
        this.vertexB.getXnumber(),
        this.vertexC.getXnumber(),
      ) + 1,
      Math.min(
        this.vertexA.getYnumber(),
        this.vertexB.getYnumber(),
        this.vertexC.getYnumber(),
      ) - 1,
      Math.max(
        this.vertexA.getYnumber(),
        this.vertexB.getYnumber(),
        this.vertexC.getYnumber(),
      ) + 1,
    ];
  }

  getSideAName(): string {
    return this.vertexB.name + this.vertexC.name;
  }

  getSideBName(): string {
    return this.vertexC.name + this.vertexA.name;
  }

  getSideCName(): string {
    return this.vertexA.name + this.vertexB.name;
  }
}
