import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

export function varianceAsNode(
  xValues: number[],
  avgX: AlgebraicNode,
): AlgebraicNode {
  const two = new NumberNode(2);
  let result: AlgebraicNode = new PowerNode(
    new SubstractNode(new NumberNode(xValues[0]), avgX).simplify(),
    two,
  ).simplify();
  for (let i = 1; i < xValues.length; i++) {
    result = new AddNode(
      result,
      new PowerNode(
        new SubstractNode(new NumberNode(xValues[i]), avgX).simplify(),
        two,
      ).simplify(),
    ).simplify();
  }
  return new FractionNode(result, new NumberNode(xValues.length)).simplify();
}

export function variance(xValues: number[], avgX: number): number {
  const xPow = xValues.map((value) => {
    return Math.pow(value - avgX, 2);
  });
  const variance = xPow.reduce((acc, value) => {
    return acc + value;
  });
  return variance / xValues.length;
}
