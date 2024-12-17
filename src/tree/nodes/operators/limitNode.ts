// import { pow } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType, ToTexOptions } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { MultiplyNode, isMultiplyNode } from "./multiplyNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";

export function isLimitNode(a: Node): a is LimitNode {
  return isOperatorNode(a) && a.id === OperatorIds.limit;
}

export class LimitNode implements OperatorNode {
  opts?: NodeOptions;
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  from: "+" | "-" | undefined;

  /**
   *
   * @param leftChild x to ..
   * @param rightChild f(x)
   * @param from + ou - pour les VI
   * @param opts
   */
  constructor(
    leftChild: AlgebraicNode,
    rightChild: AlgebraicNode,
    from?: "+" | "-",
    opts?: NodeOptions,
  ) {
    this.id = OperatorIds.limit;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
    this.from = from;
  }

  toMathString(): string {
    return `limit_(${this.leftChild.toMathString()})(${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes(opts?: NodeOptions | undefined) {
    return [this];
  }
  toIdentifiers() {
    return {
      id: NodeIds.limit,
      leftChild: this.leftChild.toIdentifiers(),
      rightChild: this.rightChild.toIdentifiers(),
      from: this.from,
    };
  }
  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(opts?: ToTexOptions): string {
    const displayStyle = opts?.displayStyle ?? true;
    let rightTex = this.rightChild.toTex();
    let leftTex = this.leftChild.toTex();
    let fromDisplay = this.from === "+" ? "^+" : this.from === "-" ? "^-" : "";

    return `${
      displayStyle ? "\\displaystyle" : ""
    }\\lim_{x \\to ${leftTex}${fromDisplay}} ${rightTex}`;
  }

  evaluate(vars?: Record<string, number>): number {
    throw Error("unimplemented limit evaluation");
  }

  simplify(opts?: SimplifyOptions): AlgebraicNode {
    return this;
  }
  equals(node: AlgebraicNode): boolean {
    return (
      isLimitNode(node) &&
      node.leftChild.equals(this.leftChild) &&
      node.rightChild.equals(this.rightChild)
    );
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return new LimitNode(
      this.leftChild.toDetailedEvaluation(vars),
      this.rightChild.toDetailedEvaluation(vars),
      this.from,
    );
  }
  derivative(varName?: string | undefined): AlgebraicNode {
    throw new Error("unimplemented derivative");
  }
}
