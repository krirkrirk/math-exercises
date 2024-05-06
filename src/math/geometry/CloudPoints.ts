import { isElement } from "lodash";
import { Point, PointConstructor } from "./point";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiEqualNode } from "#root/tree/nodes/equations/multiEqualNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

export abstract class CloudPointsConstructor {
  static random(nbPoints: number) {
    let names: string[] = [];
    for (let i = 0; i < nbPoints; i++) {
      names.concat(i + "");
    }
    return new CloudPoints(PointConstructor.randomDifferent(names));
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
      xValues.reduce((accumulator, nb) => {
        return accumulator + Math.pow(nb, 2);
      }) / this.points.length;
    const avgXY =
      xValues.reduce((accumulator, nb, i) => {
        return accumulator + nb * yValues[i];
      }) / this.points.length;
    const a = new FractionNode(
      new NumberNode(avgXY - avgX * avgY),
      new NumberNode(avgXsquare - Math.pow(avgX, 2)),
    ).simplify();
    const b = new SubstractNode(
      new NumberNode(avgY),
      new MultiplyNode(a, new NumberNode(avgX)),
    ).simplify();
    return new EqualNode(
      new VariableNode("y"),
      new AddNode(new MultiplyNode(a, new VariableNode("x")).simplify(), b),
    );
  }
}
