export enum NodeType {
  number,
  constant,
  variable,
  operator,
  function,
}

export interface Node {
  type: NodeType;
  toMathString: () => string;
  toTex: () => string;
  toMathjs: () => any;
  // simplify: () => Node;
}
