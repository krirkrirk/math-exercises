import { log } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds } from "./functionNode";

export class LogNode implements FunctionNode {
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
    return `log(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    if (!this.opts?.allowLnOfOne && tex === "1") {
      return "0";
    }
    const shouldntUseBrackets =
      this.child.type === NodeType.function &&
      (this.child as FunctionNode).id === FunctionsIds.abs;
    if (shouldntUseBrackets) return `\\ln${tex}`;
    else return `\\ln\\left(${tex}\\right)`;
  }
  toMathjs() {
    return log(this.child.toMathjs());
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new LogNode(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  simplify(): Node {
    return this;
  }
}
