import { Node, NodeType } from '../node';

export enum FunctionsIds {
  opposite,
  sqrt,
}

export abstract class FunctionNode {
  id: FunctionsIds;
  child: Node;
  type = NodeType.function;
  tex: string;
  constructor(id: FunctionsIds, child: Node, tex: string) {
    this.id = id;
    this.child = child;
    this.tex = tex;
  }
}
