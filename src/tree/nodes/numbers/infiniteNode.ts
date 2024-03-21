import { Node, NodeType } from "../node";
import { ConstantNode } from "./constantNode";

export function isInfiniteNode(a: Node): a is ConstantNode {
  return (
    a.type === NodeType.constant && (a as ConstantNode).tex.includes("infty")
  );
}

export const InfinityNode = new ConstantNode("\\infty", "infinity", Infinity);
export const PlusInfinityNode = new ConstantNode(
  "+\\infty",
  "infinity",
  Infinity,
);
export const MinusInfinityNode = new ConstantNode(
  "-\\infty",
  "-infinity",
  -Infinity,
);
