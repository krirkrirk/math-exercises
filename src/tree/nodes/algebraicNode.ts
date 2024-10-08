import { Node, NodeOptions } from "./node";

export type SimplifyOptions = {
  forbidFactorize?: boolean;
  forceDistributeFractions?: boolean;
  keepPowers?: boolean;
  //nb de chiffres significatifs
  scientific?: number;
  isDegree?: boolean;
};
export interface AlgebraicNode extends Node {
  evaluate: (vars: Record<string, number>) => number;
  toEquivalentNodes: (opts?: NodeOptions) => AlgebraicNode[];
  simplify: (opts?: SimplifyOptions) => AlgebraicNode;
  equals: (node: AlgebraicNode) => boolean;
  isNumeric: boolean;
}
