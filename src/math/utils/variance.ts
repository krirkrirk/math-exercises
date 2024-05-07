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
  return new FractionNode(result, new NumberNode(xValues.length));
}

export function variance(xValues: number[], avgX: number): number {
  const variance = xValues.reduce((acc, current) => {
    return acc + Math.pow(current - avgX, 2);
  });
  return variance / xValues.length;
}
