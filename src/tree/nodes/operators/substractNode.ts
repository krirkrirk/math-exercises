import { subtract } from "mathjs";
import { Node, NodeType } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { OppositeNode } from "../functions/oppositeNode";
import { AddNode } from "./addNode";
export function isSubstractNode(a: Node): a is SubstractNode {
  return isOperatorNode(a) && a.id === OperatorIds.substract;
}
export class SubstractNode implements OperatorNode {
  id: OperatorIds;
  leftChild: Node;
  rightChild: Node;
  type: NodeType;
  constructor(leftChild: Node, rightChild: Node) {
    this.id = OperatorIds.substract;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
  }

  toMathString(): string {
    return `${this.leftChild.toMathString()}-(${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes(): Node[] {
    const res: Node[] = [];
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

    if (needBrackets) rightTex = `(${rightTex})`;

    return `${leftTex}-${rightTex}`;
  }
  toMathjs() {
    return subtract(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
