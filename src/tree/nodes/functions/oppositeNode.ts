import { Node, NodeType } from "../node";
import { OperatorNode } from "../operators/operatorNode";
import { FunctionNode, FunctionsIds } from "./functionNode";

export class OppositeNode extends FunctionNode {
  constructor(child: Node) {
    super(FunctionsIds.opposite, child, "-");
  }
  toString(): string {
    return `-(${this.child})`;
  }
}
