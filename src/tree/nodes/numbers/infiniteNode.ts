import { Node, NodeType } from "../node";
import { ConstantNode } from "./constantNode";

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
