import { Point, PointConstructor } from "./point";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { NumberNode, isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { randint } from "../utils/random/randint";
import { covarianceXY } from "../utils/covariance";
import { variance } from "../utils/variance";

export abstract class CloudPointsConstructor {
  static random(nbPoints: number) {
    const names: string[] = [];
    for (let i = 0; i < nbPoints; i++) {
      names.push(`a${i}`);
    }
    return new CloudPoints(PointConstructor.randomDifferent(names));
  }

  static randomLinear(nbPoints: number) {
    const points: Point[] = [];
    const deltaX = randint(1, 4, [0]);
    const deltaY = randint(1, 4, [0]);
    const a = randint(-5, 6, [0]);
    const b = randint(-5, 6);
    for (let i = -nbPoints * 2; i < nbPoints * 2; i += 4) {
      points.push(
        new Point(
          `a${i + nbPoints * 2}`,
          new NumberNode(i),
          new NumberNode(a * i + b),
        ),
      );
    }
    points.forEach((point) => {
      const x = point.getXnumber();
      const y = point.getYnumber();
      point.y = new NumberNode(y + randint(-deltaX, deltaX + 1));
      point.x = new NumberNode(
        x + randint(-deltaY, deltaY + 1, [deltaX, -deltaX]),
      );
    });
    return new CloudPoints(points);
  }
}

export class CloudPoints {
  points: Point[];

  constructor(points: Point[]) {
    this.points = points;
  }

  getFineAdjustement(): EqualNode {
    const xValues = this.points.map((element) => {
      return element.getXnumber();
    });
    const yValues = this.points.map((element) => {
      return element.getYnumber();
    });
    const avgX =
      xValues.reduce((accumulator, nb) => {
        return accumulator + nb;
      }) / this.points.length;
    const avgY =
      yValues.reduce((accumulator, nb) => {
        return accumulator + nb;
      }) / this.points.length;
    const avgXsquare =
      xValues
        .map((point) => {
          return point * point;
        })
        .reduce((acc, nb) => {
          return acc + nb;
        }) / this.points.length;
    const avgXY =
      xValues
        .map((point, i) => {
          return point * yValues[i];
        })
        .reduce((acc, nb) => {
          return acc + nb;
        }) / this.points.length;
    const a = (avgXY - avgX * avgY) / (avgXsquare * Math.pow(avgX, avgX));
    const b = avgY - a * avgX;

    return new EqualNode(
      new VariableNode("y"),
      new AddNode(
        new MultiplyNode(
          new NumberNode(+a.toFixed(2)),
          new VariableNode("x"),
        ).simplify(),
        new NumberNode(+b.toFixed(2)),
      ),
    );
  }

  getCorrelationCoeff() {
    const xValues = this.points.map((point) => {
      return point.getXnumber();
    });
    const yValues = this.points.map((point) => {
      return point.getYnumber();
    });
    const avgX =
      xValues.reduce((accumulator, nb) => {
        return accumulator + nb;
      }) / this.points.length;
    const avgY =
      yValues.reduce((accumulator, nb) => {
        return accumulator + nb;
      }) / this.points.length;
    const covXY = covarianceXY(xValues, avgX, yValues, avgY);
    const xVariance = variance(xValues, avgX);
    const yVariance = variance(yValues, avgY);
    return new NumberNode(
      +(covXY / Math.sqrt(xVariance * yVariance)).toFixed(2),
    );
  }
}
