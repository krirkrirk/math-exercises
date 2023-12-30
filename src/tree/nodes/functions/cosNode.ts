// import { cos } from "mathjs";
import { Node, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
export function isCosNode(a: Node): a is CosNode {
  return isFunctionNode(a) && a.id === FunctionsIds.cos;
}
export class CosNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.opposite;
    this.child = child;
    this.type = NodeType.function;
  }

  toMathString(): string {
    return `cos(${this.child.toMathString()})`;
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new CosNode(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(): string {
    return `\\cos\\left(${this.child.toTex()}\\right)`;
  }

  // toMathjs() {
  //   return cos(this.child.toMathjs());
  // }

  simplify(): Node {
    return this;
  }
}
