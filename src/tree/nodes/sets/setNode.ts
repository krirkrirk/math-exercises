import { Node, NodeOptions, NodeType } from "../node";

export enum SetIds {
  interval,
  discrete,
  union,
}
export interface SetNode extends Node {
  id: SetIds;
  toEquivalentNodes: (opts?: NodeOptions) => SetNode[];
}

export function isSetNode(a: Node): a is SetNode {
  return a.type === NodeType.set;
}
