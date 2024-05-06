import { Point, PointConstructor } from "./point";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { NumberNode, isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

export abstract class CloudPointsConstructor {
  static random(nbPoints: number) {
    const names: string[] = [];
    for (let i = 0; i < nbPoints; i++) {
      names.push(`a${i}`);
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
    const lengthNode = new NumberNode(this.points.length);
    const xValues = this.points.map((element) => {
      return element.getXnumber();
    });
    const yValues = this.points.map((element) => {
      return element.getYnumber();
    });
    const avgX = new FractionNode(
      new NumberNode(
        xValues.reduce((accumulator, nb) => {
          return accumulator + nb;
        }),
      ),
      lengthNode,
    ).simplify();
    const avgY = new FractionNode(
      new NumberNode(
        yValues.reduce((accumulator, nb) => {
          return accumulator + nb;
        }),
      ),
      lengthNode,
    ).simplify();
    const avgXsquare = new FractionNode(
      new NumberNode(
        xValues
          .map((point) => {
            return point * point;
          })
          .reduce((acc, nb) => {
            return acc + nb;
          }),
      ),
      lengthNode,
    ).simplify();
    const avgXY = new FractionNode(
      new NumberNode(
        xValues
          .map((point, i) => {
            return point * yValues[i];
          })
          .reduce((acc, nb) => {
            return acc + nb;
          }),
      ),
      lengthNode,
    ).simplify();
    const a = new FractionNode(
      new SubstractNode(
        avgXY,
        new MultiplyNode(avgX, avgY).simplify(),
      ).simplify(),
      new SubstractNode(
        avgXsquare,
        new MultiplyNode(avgX, avgX).simplify(),
      ).simplify(),
    ).simplify();
    const b = new SubstractNode(
      avgY,
      new MultiplyNode(a, avgX).simplify(),
    ).simplify();

    return new EqualNode(
      new VariableNode("y"),
      new AddNode(
        isNumberNode(a)
          ? new MultiplyNode(a, new VariableNode("x")).simplify()
          : new MultiplyNode(a, new VariableNode("x")),
        b,
      ),
    );
  }
}
