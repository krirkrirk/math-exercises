export enum NodeType {
  number,
  constant,
  variable,
  operator,
  function,
  set,
  inequation,
  point,
  mesure,
  equality,
  belongs,
  vector,
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
};
export interface Node {
  type: NodeType;
  opts?: NodeOptions;
  toMathString: () => string;
  toEquivalentNodes: (opts?: NodeOptions) => Node[];
  toAllValidTexs: (opts?: NodeOptions) => string[];
  toTex: () => string;
  // toMathjs: () => any;
  // simplify: () => Node;
}
