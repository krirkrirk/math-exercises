import { unaryMinus } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "../operators/operatorNode";
import { FunctionNode, FunctionsIds } from "./functionNode";
import { NumberNode } from "../numbers/numberNode";

export class OppositeNode implements FunctionNode {
  id: FunctionsIds;
  child: Node;
  type: NodeType;
  opts?: NodeOptions;
  constructor(child: Node, opts?: NodeOptions) {
    this.id = FunctionsIds.opposite;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
  }
  toMathString(): string {
    return `-(${this.child.toMathString()})`;
  }
  toTex(): string {
    let childTex = this.child.toTex();
    let needBrackets = childTex[0] === "-";
    if (this.child.type === NodeType.operator) {
      const operatorChild = this.child as OperatorNode;
      needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(
        operatorChild.id,
      );
    }
    if (this.child.type === NodeType.number && childTex[0] === "-") {
      return childTex.substring(1);
    }
    if (needBrackets) childTex = `\\left(${childTex}\\right)`;
    return `-${childTex}`;
  }

  toEquivalentNodes(opts?: NodeOptions): Node[] {
    const options = opts ?? this.opts;
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes(options);
    childNodes.forEach((childNode) => {
      res.push(new OppositeNode(childNode));
    });
    return res;
  }

  toAllValidTexs(opts?: NodeOptions): string[] {
    const options = opts ?? this.opts;
    return this.toEquivalentNodes(options).map((node) => node.toTex());
  }

  toMathjs() {
    return unaryMinus(this.child.toMathjs());
  }
}
