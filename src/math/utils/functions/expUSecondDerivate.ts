import { Polynomial } from "#root/math/polynomials/polynomial";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { expUDerivate } from "./expUDerivate";

export const expuSecondDerivative = (
  e: ExpNode,
  u: Polynomial,
): AlgebraicNode => {
  const uDerivated = u.derivate().toTree();
  const uSecondDerivated = u.secondDerivate();
  return new AddNode(
    new MultiplyNode(uSecondDerivated.toTree(), e).simplify(),
    new MultiplyNode(uDerivated, expUDerivate(e, u)).simplify(),
  ).simplify();
};
