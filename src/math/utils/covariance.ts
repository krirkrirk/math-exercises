import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

export function covXYAsNode(
  xValues: number[],
  avgX: AlgebraicNode,
  yValues: number[],
  avgY: AlgebraicNode,
): AlgebraicNode {
  let node: AlgebraicNode = new MultiplyNode(
    new SubstractNode(new NumberNode(xValues[0]), avgX).simplify(),
    new SubstractNode(new NumberNode(yValues[0]), avgY).simplify(),
  ).simplify();
  for (let i = 1; i < xValues.length; i++) {
    node = new AddNode(
      node,
      new MultiplyNode(
        new SubstractNode(new NumberNode(xValues[i]), avgX).simplify(),
        new SubstractNode(new NumberNode(yValues[i]), avgY).simplify(),
      ).simplify(),
    ).simplify();
  }
  return new FractionNode(node, new NumberNode(xValues.length)).simplify();
}

export function covarianceXY(
  xValues: number[],
  avgX: number,
  yValues: number[],
  avgY: number,
): number {
  const xy = xValues.map((value, index) => {
    return (value - avgX) * (yValues[index] - avgY);
  });

  const covarianceXY = xy.reduce((acc, value) => {
    return acc + value;
  });
  return covarianceXY / xValues.length;
}
