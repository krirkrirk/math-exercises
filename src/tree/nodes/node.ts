export enum NodeType {
  number,
  variable,
  operator,
  function,
}

export interface Node {
  type: NodeType;
  toMathString: () => string;
  toTex: () => string;
}
