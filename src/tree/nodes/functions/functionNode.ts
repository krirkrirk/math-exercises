import { Node, NodeType } from '../node';

export enum FunctionsIds {
  opposite,
  sqrt,
  cos,
  sin,
  log,
  exp,
}

export interface FunctionNode extends Node {
  id: FunctionsIds;
  child: Node;
  // tex: string;
  // constructor(id: FunctionsIds, child: Node, tex: string) {
  //   this.id = id;
  //   this.child = child;
  //   this.tex = tex;
  // }
}
