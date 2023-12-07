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
  toEquivalentNodes: () => Node[];
  toAllValidTexs: () => string[];
  toTex: () => string;
  toMathjs: () => any;
  // simplify: () => Node;
}
