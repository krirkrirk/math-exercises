import { Node, NodeOptions } from "./node";

export interface AlgebraicNode extends Node {
  // multiply: (n: AlgebraicNode) => AlgebraicNode;
  evaluate: (vars: Record<string, number>) => number;
  toEquivalentNodes: (opts?: NodeOptions) => AlgebraicNode[];
}
//tous les operators et function
// tous les externals (number, variable, constant, length)
//implémenter les opérations add, substract, divide, power etc
