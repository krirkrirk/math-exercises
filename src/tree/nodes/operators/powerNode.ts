// import { pow } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { MultiplyNode } from "./multiplyNode";
import { AlgebraicNode } from "../algebraicNode";
import { isExpNode } from "../functions/expNode";
import { isLogNode } from "../functions/logNode";
import { isSqrtNode } from "../functions/sqrtNode";

export function isPowerNode(a: Node): a is PowerNode {
  return isOperatorNode(a) && a.id === OperatorIds.power;
}

export class PowerNode implements OperatorNode {
  opts?: NodeOptions;
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
    this.id = OperatorIds.power;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()})^(${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes() {
    const res: AlgebraicNode[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new PowerNode(leftNode, rightNode));
        if (!this.opts?.forbidPowerToProduct && isNumberNode(this.rightChild)) {
          const power = this.rightChild.value;
          if (Math.floor(power) !== power || power < 2) return;
          let tree = new MultiplyNode(leftNode, leftNode);
          for (let i = 2; i < power; i++) {
            tree = new MultiplyNode(tree, leftNode);
          }
          res.push(tree);
        }
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
    let needBrackets = leftTex[0] === "-";
    if (isOperatorNode(this.leftChild)) {
      needBrackets ||= [
        OperatorIds.add,
        OperatorIds.substract,
        OperatorIds.multiply,
        OperatorIds.divide,
        OperatorIds.fraction,
        OperatorIds.power,
      ].includes(this.leftChild.id);
    }
    if (needBrackets) leftTex = `\\left(${leftTex}\\right)`;
    const needBrace = rightTex.length > 1;
    if (needBrace) return `${leftTex}^{${rightTex}}`;
    else return `${leftTex}^${rightTex}`;
  }

  // toMathjs() {
  //   return pow(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }
  evaluate(vars: Record<string, number>) {
    return Math.pow(
      this.leftChild.evaluate(vars),
      this.rightChild.evaluate(vars),
    );
  }

  // simplify(): AlgebraicNode {
  //   const leftSimplified = this.leftChild.simplify();
  //   const rightSimplified = this.rightChild.simplify();
  //   if (isNumberNode(rightSimplified)) {
  //     const value = rightSimplified.value;
  //     if (value === 0) return new NumberNode(1);
  //     if (value === 1) return leftSimplified;
  //   }
  //   if (isNumberNode(leftSimplified)) {
  //     const value = leftSimplified.value;
  //     if (value === 0) return leftSimplified;
  //     if (value === 1) return leftSimplified;
  //   }
  //   if (isNumberNode(rightSimplified) && isNumberNode(leftSimplified)) {
  //     const value = this.evaluate({});
  //     // à partir de ^21 et de ^-7, javascript returns des écritures scientifiques
  //     if (
  //       Math.abs(value) < Math.pow(10, 21) ||
  //       Math.abs(value) < Math.pow(10, -7)
  //     ) {
  //       return new NumberNode(value);
  //     } else return this;
  //   }
  //   if (isExpNode(leftSimplified) && isLogNode(rightSimplified)) {
  //     return rightSimplified.child;
  //   }
  //   if (isPowerNode(leftSimplified)) {
  //     return new PowerNode(
  //       leftSimplified.leftChild,
  //       new MultiplyNode(leftSimplified.rightChild, rightSimplified),
  //     ).simplify();
  //   }
  //   if (isSqrtNode(leftSimplified) && isNumberNode(rightSimplified)) {
  //   }
  //   //! simplifications possibles :
  //   // puissances négatives ?
  // }

  simplify() {
    return this;
  }
  equals(node: AlgebraicNode) {
    return (
      isPowerNode(node) &&
      node.leftChild.equals(this.leftChild) &&
      node.rightChild.equals(this.rightChild)
    );
  }
}

export class SquareNode extends PowerNode {
  constructor(child: AlgebraicNode, opts?: NodeOptions) {
    super(child, new NumberNode(2), opts);
  }
}
