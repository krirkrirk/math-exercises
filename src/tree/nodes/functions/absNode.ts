// import { abs } from "mathjs";
import { Node, NodeIds, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
import { isNumberNode } from "../numbers/numberNode";
import { isOppositeNode } from "./oppositeNode";
export function isAbsNode(a: Node): a is AbsNode {
  return isFunctionNode(a) && a.id === FunctionsIds.abs;
}
export class AbsNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.abs;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.abs,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `abs(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\left|${this.child.toTex()}\\right|`;
  }
  // toMathjs() {
  //   return abs(this.child.toMathjs());
  // }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new AbsNode(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  simplify() {
    const childSimplified = this.child.simplify();
    if (isNumberNode(childSimplified))
      return Math.abs(childSimplified.value).toTree();
    if (isOppositeNode(childSimplified)) {
      return childSimplified.child;
    }
    return new AbsNode(childSimplified);
  }

  evaluate(vars?: Record<string, number>) {
    return Math.abs(this.child.evaluate(vars));
  }
  equals(node: AlgebraicNode) {
    return isAbsNode(node) && node.child.equals(this.child);
  }

  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return new AbsNode(this.child.toDetailedEvaluation(vars));
  }
}
