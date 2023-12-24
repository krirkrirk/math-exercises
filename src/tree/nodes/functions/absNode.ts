import { abs } from "mathjs";
import { Node, NodeType } from "../node";
import { FunctionNode, FunctionsIds } from "./functionNode";

export class AbsNode implements FunctionNode {
  id: FunctionsIds;
  child: Node;
  type: NodeType;

  constructor(child: Node) {
    this.id = FunctionsIds.abs;
    this.child = child;
    this.type = NodeType.function;
  }

  toMathString(): string {
    return `abs(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\left|${this.child.toTex()}\\right|`;
  }
  toMathjs() {
    return abs(this.child.toMathjs());
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new AbsNode(childNode));
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
