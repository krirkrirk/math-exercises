import { Polynomial } from "#root/math/polynomials/polynomial";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

export const expUDerivate = (e: ExpNode, u: Polynomial): AlgebraicNode => {
  const uDerivated = u.derivate().toTree();
  return new MultiplyNode(uDerivated, e).simplify();
};
