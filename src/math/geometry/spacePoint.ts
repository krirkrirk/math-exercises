import { NodeType } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

import { Rational } from "../numbers/rationals/rational";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { Vector, VectorConstructor } from "./vector";
import { randint } from "../utils/random/randint";

type AleaBound = { min?: number; max?: number; excludes?: number[] };
export abstract class SpacePointConstructor {
  static random(
    name: string,
    xOpts?: AleaBound,
    yOpts?: AleaBound,
    zOpts?: AleaBound,
  ): SpacePoint {
    const x = randint(
      xOpts?.min ?? -9,
      xOpts?.max ?? 10,
      xOpts?.excludes ?? [],
    );
    const y = randint(
      yOpts?.min ?? -9,
      yOpts?.max ?? 10,
      yOpts?.excludes ?? [],
    );
    const z = randint(
      zOpts?.min ?? -9,
      zOpts?.max ?? 10,
      zOpts?.excludes ?? [],
    );

    return new SpacePoint(
      name,
      new NumberNode(x),
      new NumberNode(y),
      new NumberNode(z),
    );
  }

  static randomDifferent(names: string[]) {
    const res: SpacePoint[] = [];
    const points: number[][] = [];
    for (let i = 0; i < names.length; i++) {
      let x: number;
      let y: number;
      let z: number;
      do {
        x = randint(-10, 11);
        y = randint(-10, 11);
        z = randint(-10, 11);
      } while (
        points.some(
          (point) => point[0] === x && point[1] === y && point[2] === z,
        )
      );
      points.push([x, y, z]);
      res.push(
        new SpacePoint(
          names[i],
          new NumberNode(x),
          new NumberNode(y),
          new NumberNode(z),
        ),
      );
    }
    return res;
  }
}

export class SpacePoint {
  name: string;
  x: AlgebraicNode;
  y: AlgebraicNode;
  z: AlgebraicNode;
  constructor(
    name: string,
    x: AlgebraicNode,
    y: AlgebraicNode,
    z: AlgebraicNode,
  ) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toTex(): string {
    return `${this.name}`;
  }

  toTexWithCoords(): string {
    return `${
      this.name
    }\\left(${this.x.toTex()};${this.y.toTex()};${this.z.toTex()}\\right)`;
  }
  toCoords(): string {
    return `\\left(${this.x.toTex()};${this.y.toTex()};${this.z.toTex()}\\right)`;
  }

  midpoint(B: SpacePoint, name = "I"): SpacePoint {
    // const types = [this.x.type, this.y.type, B.x.type, B.y.type];
    // if (types.some((type) => type !== NodeType.number)) {
    //   throw Error("general midpoint not implemented yet");
    // }
    // return new Point(
    //   name,
    //   new Rational((this.x as NumberNode).value + (B.x as NumberNode).value, 2)
    //     .simplify()
    //     .toTree(),

    //   new Rational((this.y as NumberNode).value + (B.y as NumberNode).value, 2)
    //     .simplify()
    //     .toTree(),
    // );
    throw Error("unimplemented");
  }

  distanceTo(B: SpacePoint): number {
    throw Error("unimplemented");
  }

  equals(B: SpacePoint): boolean {
    return this.x.equals(B.x) && this.y.equals(B.y) && this.z.equals(B.z);
  }
  isAligned(B: SpacePoint, C: SpacePoint) {
    // const AB = VectorConstructor.fromPoints(this, B);
    // const AC = VectorConstructor.fromPoints(this, C);
    // return AB.isColinear(AC);
    throw Error("unimplemented");
  }

  toGGBCommand() {
    return `${
      this.name
    } = (${this.x.toMathString()}, ${this.y.toMathString()}, ${this.z.toMathString()}})`;
  }
}
