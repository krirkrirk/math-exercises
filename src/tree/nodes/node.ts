export enum NodeType {
  number,
  variable,
  operator,
  function,
}

export interface Node {
  type: NodeType;
  tex: string;
  id: string;
  leftChild: Node | null;
  rightChild: Node | null;
}
