import { combinations } from "#root/math/utils/combinatorics/combination";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { Node, NodeIds, NodeOptions, NodeType, ToTexOptions } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";

export const isBinomialCoefficientNode = (
  a: Node,
): a is BinomialCoefficientNode =>
  isOperatorNode(a) && a.id === OperatorIds.binomialCoefficient;

export class BinomialCoefficientNode implements OperatorNode {
  opts?: NodeOptions;
  /**
   * @param leftChild num
   * @param rightChild denum
   */
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  constructor(
    leftChild: AlgebraicNode,
    rightChild: AlgebraicNode,
    opts?: NodeOptions,
  ) {
    this.id = OperatorIds.binomialCoefficient;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
  }
  equals(node: AlgebraicNode) {
    return (
      isBinomialCoefficientNode(node) &&
      this.leftChild.equals(node.leftChild) &&
      this.rightChild.equals(node.rightChild)
    );
  }
  evaluate() {
    return combinations(this.rightChild.evaluate(), this.leftChild.evaluate());
  }
  simplify() {
    return this;
  }
  toAllValidTexs() {
    return [this.toTex()];
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return new BinomialCoefficientNode(
      this.leftChild.toDetailedEvaluation(vars),
      this.rightChild.toDetailedEvaluation(vars),
    );
  }
  toEquivalentNodes() {
    return [this];
  }
  toIdentifiers() {
    return {
      leftChild: this.leftChild.toIdentifiers(),
      rightChild: this.rightChild.toIdentifiers(),
      id: NodeIds.binomialCoefficient,
    };
  }
  toMathString() {
    return `nCr(${this.leftChild.toMathString()}, ${this.rightChild.toMathString()})`;
  }
  toTex() {
    return `\\binom{${this.leftChild.toTex()}}${this.rightChild.toTex()}}`;
  }
  derivative(varName?: string | undefined): AlgebraicNode {
    throw new Error("unimplemented derivative");
  }
}
