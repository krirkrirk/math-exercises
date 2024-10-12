// import { divide } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { AlgebraicNode } from "../algebraicNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
export function isDivideNode(a: Node): a is DivideNode {
  return isOperatorNode(a) && a.id === OperatorIds.divide;
}
const divideNodeToTex = (leftChild: Node, rightChild: Node) => {
  let rightTex = rightChild.toTex();
  let leftTex = leftChild.toTex();

  if (isOperatorNode(leftChild)) {
    if (
      [OperatorIds.add, OperatorIds.substract, OperatorIds.multiply].includes(
        leftChild.id,
      )
    )
      leftTex = `\\left(${leftTex}\\right)`;
  }
  let needBrackets = rightTex[0] === "-";
  if (isOperatorNode(rightChild)) {
    needBrackets ||= [
      OperatorIds.add,
      OperatorIds.substract,
      OperatorIds.divide,
    ].includes(rightChild.id);
  }
  if (needBrackets) rightTex = `\\left(${rightTex}\\right)`;
  const nextIsLetter = rightTex[0].toLowerCase() !== rightTex[0].toUpperCase();
  return `${leftTex}\\div${nextIsLetter ? " " : ""}${rightTex}`;
};

export class DivideNode implements OperatorNode {
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  /**
   * @param leftChild num
   * @param rightChild denum
   */

  constructor(leftChild: AlgebraicNode, rightChild: AlgebraicNode) {
    this.id = OperatorIds.divide;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()}) / (${this.rightChild.toMathString()})`;
  }
  dangerouslyShuffle() {
    if (coinFlip())
      [this.leftChild, this.rightChild] = [this.rightChild, this.leftChild];
  }
  toIdentifiers() {
    return {
      id: NodeIds.divide,
      leftChild: this.leftChild.toIdentifiers(),
      rightChild: this.rightChild.toIdentifiers(),
    };
  }

  toEquivalentNodes(opts?: NodeOptions) {
    const res: AlgebraicNode[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new DivideNode(leftNode, rightNode));
      });
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(): string {
    return divideNodeToTex(this.leftChild, this.rightChild);
  }
  evaluate(vars: Record<string, number>) {
    return this.leftChild.evaluate(vars) / this.rightChild.evaluate(vars);
  }
  // toMathjs() {
  //   return divide(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }
  simplify() {
    return this;
  }
  equals(node: AlgebraicNode) {
    return (
      isDivideNode(node) &&
      node.leftChild.equals(this.leftChild) &&
      node.rightChild.equals(this.rightChild)
    );
  }
}
