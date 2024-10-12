// import { subtract } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType, ToTexOptions } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { OppositeNode } from "../functions/oppositeNode";
import { AddNode } from "./addNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { colorize } from "#root/utils/latex/colorize";
export function isSubstractNode(a: Node): a is SubstractNode {
  return isOperatorNode(a) && a.id === OperatorIds.substract;
}
export class SubstractNode implements OperatorNode {
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  opts?: NodeOptions;
  constructor(
    leftChild: AlgebraicNode,
    rightChild: AlgebraicNode,
    opts?: NodeOptions,
  ) {
    this.id = OperatorIds.substract;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
  }

  toMathString(): string {
    return `${this.leftChild.toMathString()}-(${this.rightChild.toMathString()})`;
  }
  toIdentifiers() {
    return {
      id: NodeIds.substract,
      left: this.leftChild.toIdentifiers(),
      right: this.rightChild.toIdentifiers(),
    };
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
  dangerouslyShuffle() {
    if (coinFlip())
      [this.leftChild, this.rightChild] = [this.rightChild, this.leftChild];
  }
  toTex(options?: ToTexOptions): string {
    const opts = this.opts?.toTexOptions ?? options;
    const childOpts = { ...opts };
    const color = opts?.color;

    if (color) childOpts.color = undefined;

    let rightTex = this.rightChild.toTex(childOpts);
    let leftTex = this.leftChild.toTex(childOpts);
    const needBrackets =
      (isOperatorNode(this.rightChild) &&
        [OperatorIds.add, OperatorIds.substract].includes(
          this.rightChild.id,
        )) ||
      rightTex[0] === "-";

    if (needBrackets) rightTex = `\\left(${rightTex}\\right)`;

    return colorize(`${leftTex}-${rightTex}`, color);
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
