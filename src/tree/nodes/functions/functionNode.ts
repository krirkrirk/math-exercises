import { AlgebraicNode } from "../algebraicNode";
import { Node, NodeType } from "../node";

export function isFunctionNode(a: Node): a is FunctionNode {
  return a.type === NodeType.function;
}

export enum FunctionsIds {
  opposite,
  sqrt,
  cos,
  sin,
  tan,
  log,
  log10,
  exp,
  abs,
  arcsin,
  arccos,
  arctan,
}

export interface FunctionNode extends AlgebraicNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  // tex: string;
  // constructor(id: FunctionsIds, child: Node, tex: string) {
  //   this.id = id;
  //   this.child = child;
  //   this.tex = tex;
  // }
}
