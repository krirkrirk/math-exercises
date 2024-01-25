import { Node, NodeOptions } from "./node";

export type SimplifyOptions = {
  forbidFactorize?: boolean;
  forceDistributeFractions?: boolean;
};
export interface AlgebraicNode extends Node {
  // multiply: (n: AlgebraicNode) => AlgebraicNode;
  evaluate: (vars: Record<string, number>) => number;
  toEquivalentNodes: (opts?: NodeOptions) => AlgebraicNode[];
  simplify: (opts?: SimplifyOptions) => AlgebraicNode;
  equals: (node: AlgebraicNode) => boolean;
  isNumeric: boolean;
}
//tous les operators et function
// tous les externals (number, variable, constant, length)
//implémenter les opérations add, substract, divide, power etc
