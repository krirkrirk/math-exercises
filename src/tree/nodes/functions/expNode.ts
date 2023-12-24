import { exp } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds } from "./functionNode";

export class ExpNode implements FunctionNode {
  opts?: NodeOptions;
  id: FunctionsIds;
  child: Node;
  type: NodeType;
  constructor(child: Node, opts?: NodeOptions) {
    this.id = FunctionsIds.exp;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
  }

  toMathString(): string {
    return `e^(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    if (this.opts?.useExpNotation) {
      return `\\exp\\left(${tex}\\right)`;
    }
    const needBraces = tex.length > 1;
    if (needBraces) return `e^{${tex}}`;
    return `e^${tex}`;
  }
  toMathjs() {
    return exp(this.child.toMathjs());
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new ExpNode(childNode));
      res.push(new ExpNode(childNode, { useExpNotation: true }));
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
