import { Node, NodeType } from "../node";
import { FunctionNode, FunctionsIds } from "./functionNode";

export class SqrtNode extends FunctionNode {
  type: NodeType = NodeType.function;
  constructor(child: Node) {
    super(FunctionsIds.sqrt, child, "\\sqrt");
  }
  toString(): string {
    return `sqrt(${this.child})`;
  }
}
