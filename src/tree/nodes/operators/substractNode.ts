// import { subtract } from "mathjs";
import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { OppositeNode } from "../functions/oppositeNode";
import { AddNode } from "./addNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
export function isSubstractNode(a: Node): a is SubstractNode {
  return isOperatorNode(a) && a.id === OperatorIds.substract;
}
export class SubstractNode implements OperatorNode {
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  constructor(leftChild: AlgebraicNode, rightChild: AlgebraicNode) {
    this.id = OperatorIds.substract;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
  }

  toMathString(): string {
    return `${this.leftChild.toMathString()}-(${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new SubstractNode(leftNode, rightNode));
        res.push(new AddNode(new OppositeNode(rightNode), leftNode));
      });
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  toTex(): string {
    let rightTex = this.rightChild.toTex();
    let leftTex = this.leftChild.toTex();

    const needBrackets =
      (isOperatorNode(this.rightChild) &&
        [OperatorIds.add, OperatorIds.substract].includes(
          this.rightChild.id,
        )) ||
      rightTex[0] === "-";

    if (needBrackets) rightTex = `\\left(${rightTex}\\right)`;

    return `${leftTex}-${rightTex}`;
  }
  evaluate(vars: Record<string, number>) {
    return this.leftChild.evaluate(vars) - this.rightChild.evaluate(vars);
  }
  // toMathjs() {
  //   return subtract(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }
  simplify(opts?: SimplifyOptions) {
    return new AddNode(
      this.leftChild,
      new OppositeNode(this.rightChild),
    ).simplify(opts);
  }
  equals(node: AlgebraicNode): boolean {
    return (
      isSubstractNode(node) &&
      node.leftChild.equals(this.leftChild) &&
      node.rightChild.equals(this.rightChild)
    );
  }
}
