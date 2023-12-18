export enum NodeType {
  number,
  constant,
  variable,
  operator,
  function,
  set,
}
export type NodeOptions = {
  forceTimesSign?: boolean;
  allowPowerToProduct?: boolean; //par exemple, pour x^2, si cette prop est true, toEquivalentNodes va sortir l'arbre Multiply(x,x) en plus de l'arbre Power(x,2)
  allowRawRightChildAsSolution?: boolean;
  allowFractionToDecimal?: boolean;
  forceMinusBeforeFraction?: boolean;
  useExpNotation?: boolean;
};
export interface Node {
  type: NodeType;
  opts?: NodeOptions;
  toMathString: () => string;
  toEquivalentNodes: (opts?: NodeOptions) => Node[];
  toAllValidTexs: () => string[];
  toTex: () => string;
  toMathjs: () => any;
  // simplify: () => Node;
}
