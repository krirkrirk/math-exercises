import { AlgebraicNode } from "./algebraicNode";

export enum NodeType {
  number,
  constant,
  variable,
  operator,
  function,
  inequation,
  point,
  mesure,
  equality,
  belongs,
  vector,
  set,
  trinom,
}
export type NodeOptions = {
  forceTimesSign?: boolean;
  forbidPowerToProduct?: boolean; //par exemple, pour x^2, si cette prop est true, toEquivalentNodes va sortir l'arbre Multiply(x,x) en plus de l'arbre Power(x,2)
  allowRawRightChildAsSolution?: boolean;
  allowFractionToDecimal?: boolean;
  allowMinusAnywhereInFraction?: boolean;
  useExpNotation?: boolean;
  allowLnOfOne?: boolean;
  allowPowerOne?: boolean;
  allowSimplifySqrt?: boolean;
  forceParenthesis?: boolean;
  toTexOptions?: ToTexOptions;
};

export type ToTexOptions = {
  displayStyle?: boolean;
  forceDotSign?: boolean;
  //number est le nombre de décimals significatifs
  scientific?: number;
  hideUnit?: boolean;
  notScientific?: boolean;
  forceNoSimplification?: boolean;
  forceParenthesis?: boolean;
  color?: string;
};

export enum NodeIds {
  add,
  substract,
  multiply,
  fraction,
  divide,
  power,
  limit,
  number,
  percent,
  constant,
  variable,
  belongs,
  discreteSet,
  interval,
  union,
  complex,
  equal,
  multiEqual,
  equationSolution,
  abs,
  arccos,
  arcsin,
  arctan,
  cos,
  sin,
  tan,
  log,
  log10,
  exp,
  sqrt,
  integral,
  opposite,
  degree,
  length,
  point,
  vector,
  inequation,
  inequationSolution,
}

export interface Node {
  type: NodeType;
  opts?: NodeOptions;
  toMathString: () => string;
  toEquivalentNodes: (opts?: NodeOptions) => Node[];
  toAllValidTexs: (opts?: NodeOptions) => string[];
  toTex: (opts?: ToTexOptions) => string;
  // toMathjs: () => any;
  simplify: () => Node;
  toIdentifiers: () => { id: NodeIds } & Record<string, any>;
}
