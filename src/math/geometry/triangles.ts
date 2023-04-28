import { Point } from './point';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { Node } from '#root/tree/nodes/node';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { SqrtNode } from '#root/tree/nodes/functions/sqrtNode';
import { randint } from '../utils/random/randint';
import { type } from 'os';

export abstract class TriangleConstructor {
  static createRandomRightTriangle(r1 = 0, r2 = 5, name1 = 'A', name2 = 'B', name3 = 'C'): Triangle {
    let pointA, pointB, pointC, d1: number, d2: number;
    do {
      pointA = new Point(name1, new NumberNode(randint(-10, 11)), new NumberNode(randint(-10, 11)));
      pointB = new Point(name2, new NumberNode(randint(-10, 11)), new NumberNode(randint(-10, 11)));
      d1 = pointA.distanceTo(pointB);
      const xA = pointA.getXnumber();
      const yA = pointA.getYnumber();
      const xB = pointB.getXnumber();
      const yB = pointB.getYnumber();
      const xC = randint(-11, 10);
      const yC = yA - ((xB - xA) * (xC - xA)) / (yB - yA);
      pointC = new Point(name3, new NumberNode(xC), new NumberNode(yC));
      d2 = pointA.distanceTo(pointC);
    } while (!d1 || !d2 || d1 / d2 < r1 || d1 / d2 > r2);
    return new Triangle(pointA, pointB, pointC);
  }
}

type GenerateCommandsProps = { angle?: string[]; showSideLabel?: boolean; showAngleValue?: boolean };

export class Triangle {
  vertexA: Point;
  vertexB: Point;
  vertexC: Point;

  constructor(vertexA: Point, vertexB: Point, vertexC: Point) {
    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.vertexC = vertexC;
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

  getSideAnode(): Node {
    return new SqrtNode(
      new AddNode(
        new PowerNode(new SubstractNode(this.vertexC.x, this.vertexB.x), new NumberNode(2)),
        new PowerNode(new SubstractNode(this.vertexC.y, this.vertexB.y), new NumberNode(2)),
      ),
    );
  }

  getSideBnode(): Node {
    return new SqrtNode(
      new AddNode(
        new PowerNode(new SubstractNode(this.vertexC.x, this.vertexA.x), new NumberNode(2)),
        new PowerNode(new SubstractNode(this.vertexC.y, this.vertexA.y), new NumberNode(2)),
      ),
    );
  }

  getSideCnode(): Node {
    return new SqrtNode(
      new AddNode(
        new PowerNode(new SubstractNode(this.vertexA.x, this.vertexB.x), new NumberNode(2)),
        new PowerNode(new SubstractNode(this.vertexC.y, this.vertexB.y), new NumberNode(2)),
      ),
    );
  }

  getAngleA(): number {
    return Math.acos(
      (this.getSideBnumber() ** 2 + this.getSideCnumber() ** 2 - this.getSideAnumber() ** 2) /
        (2 * this.getSideBnumber() * this.getSideCnumber()),
    );
  }

  getAngleB(): number {
    return Math.acos(
      (this.getSideBnumber() ** 2 + this.getSideCnumber() ** 2 - this.getSideAnumber() ** 2) /
        (2 * this.getSideBnumber() * this.getSideCnumber()),
    );
  }

  getAngleC(): number {
    return Math.acos(
      (this.getSideBnumber() ** 2 + this.getSideCnumber() ** 2 - this.getSideAnumber() ** 2) /
        (2 * this.getSideBnumber() * this.getSideCnumber()),
    );
  }

  getPerimeter(): number {
    return this.getSideAnumber() + this.getSideBnumber() + this.getSideCnumber();
  }

  getArea(): number {
    const s = this.getPerimeter() / 2;
    return Math.sqrt(s * (s - this.getSideAnumber()) * (s - this.getSideBnumber()) * (s - this.getSideCnumber()));
  }

  isRight(): Boolean {
    if (Math.abs(Math.cos(this.getAngleA())) < 0.001) return true;
    if (Math.abs(Math.cos(this.getAngleB())) < 0.001) return true;
    if (Math.abs(Math.cos(this.getAngleC())) < 0.001) return true;
    return false;
  }

  isEquilateral(): Boolean {
    return this.getSideAnumber() === this.getSideBnumber() && this.getSideAnumber() === this.getSideCnumber();
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
    return '';
  }

  generateCommands({ angle }: GenerateCommandsProps): string[] {
    let commands = [
      `${this.vertexA.name} = Point({${this.vertexA.getXnumber()}, ${this.vertexA.getYnumber()}})`,
      `${this.vertexB.name} = Point({${this.vertexB.getXnumber()}, ${this.vertexB.getYnumber()}})`,
      `${this.vertexC.name} = Point({${this.vertexC.getXnumber()}, ${this.vertexC.getYnumber()}})`,
      `ShowLabel(${this.vertexA.name}, true)`,
      `ShowLabel(${this.vertexB.name}, true)`,
      `ShowLabel(${this.vertexC.name}, true)`,
      `${this.getSideCName()} = Segment(${this.vertexA.name}, ${this.vertexB.name})`,
      `${this.getSideBName()} = Segment(${this.vertexA.name}, ${this.vertexC.name})`,
      `${this.getSideAName()} = Segment(${this.vertexC.name}, ${this.vertexB.name})`,
      `ShowLabel(${this.getSideCName()}, false)`,
      `ShowLabel(${this.getSideBName()}, false)`,
      `ShowLabel(${this.getSideBName()}, false)`,
      // `If(${this.isRight()})`
    ];

    if (this.isRight())
      commands.push(
        `alpha = Angle(${this.vertexB.name},${this.vertexA.name},${this.vertexC.name}, Line(${this.vertexB.name},${this.vertexA.name}))`,
        `ShowLabel(alpha, false)`,
      );

    if (angle !== undefined)
      commands.push(
        `be = Angle(${angle[0]}, ${angle[1]}, ${angle[2]}, Line(${angle[0]}, ${angle[1]}))`,
        `ShowLabel(be, false)`,
        `SetColor(be, "Red")`,
      );

    return commands;
  }

  generateCoords(): number[] {
    return [
      Math.min(this.vertexA.getXnumber(), this.vertexB.getXnumber(), this.vertexC.getXnumber()) - 1,
      Math.max(this.vertexA.getXnumber(), this.vertexB.getXnumber(), this.vertexC.getXnumber()) + 1,
      Math.min(this.vertexA.getYnumber(), this.vertexB.getYnumber(), this.vertexC.getYnumber()) - 1,
      Math.max(this.vertexA.getYnumber(), this.vertexB.getYnumber(), this.vertexC.getYnumber()) + 1,
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
