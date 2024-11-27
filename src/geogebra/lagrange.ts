import { Point } from "#root/math/geometry/point";
import { IntervalConstructor } from "#root/math/sets/intervals/intervals";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { doWhile } from "#root/utils/doWhile";
import { randomColor } from "./colors";

// export abstract class LagrangeConstructor {
//   random() {
//     const a = randint(-10, 0);
//     const b = doWhile(
//       () => randint(0, 10),
//       (x) => Math.abs(x - a) < 5,
//     );
//     return new Spline(new IntervalNode(a.toTree(), b.toTree(), ClosureType.FF));
//   }
// }
export class Lagrange {
  points: number[][];

  constructor(interval: IntervalNode, points?: Point[]) {
    const a = interval.a.evaluate({});
    const b = interval.b.evaluate();
    this.points = [];
    const sortedPoints = points
      ?.map((a) => [a.x.evaluate({}), a.y.evaluate({})])
      .sort((a, b) => a[0] - b[0]);

    if (!Number.isFinite(a) || !Number.isFinite(b))
      throw Error("unimplement infinity lagrange");
    const length = Math.abs(b - a);
    const nbOfSlices = sortedPoints?.length
      ? sortedPoints.length + 5
      : randint(4, 8);
    const step = length / nbOfSlices;
    const yCoeff = 1 / nbOfSlices;
    for (let i = 0; i < nbOfSlices; i++) {
      const xMin = a + i * step;
      const xMax = xMin + step;
      if (i === 0) {
        const pointInSlice = sortedPoints?.length && sortedPoints[0][0] < xMax;
        this.points.push([
          a,
          pointInSlice
            ? sortedPoints[0][1] + yCoeff * randfloat(-2, 3)
            : randfloat(-10, 10),
        ]);
      }

      const fittedPoints = sortedPoints?.filter(
        (point) => point[0] >= xMin && point[0] < xMax,
      );
      this.points.push(...(fittedPoints ?? []));

      if (!fittedPoints?.length && i > 0 && i < nbOfSlices - 1) {
        const nextYInSlice = sortedPoints?.find(
          (p) => p[0] >= xMax && p[0] < xMax + step,
        )?.[1];
        const x = randfloat(xMin + step / 4, xMax - step / 4, 6);
        const prevy = this.points[this.points.length - 1][1];
        const y =
          nextYInSlice !== undefined
            ? prevy + (nextYInSlice - prevy) / 2
            : prevy + yCoeff * randfloat(-3, 4, 5);
        this.points.push([x, y]);
      }

      if (i === nbOfSlices - 1) {
        const prevY = this.points[this.points.length - 1][1];

        this.points.push([b, prevY + yCoeff * randfloat(-2, 3)]);
      }
    }
  }

  getCommands() {
    const commands = [
      `P = Polynomial(${this.points
        .map((point) => `(${point[0]},${point[1]})`)
        .join(",")})`,
      "SetFixed(P, true)",
      `SetColor(P, "${randomColor()}")`,
    ];
    return commands;
  }
}
