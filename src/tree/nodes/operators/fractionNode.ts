// import { fraction } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { FunctionNode, FunctionsIds } from "../functions/functionNode";
import { round } from "#root/math/utils/round";
import { isOppositeNode } from "../functions/oppositeNode";
import { AlgebraicNode } from "../algebraicNode";
export function isFractionNode(a: Node): a is FractionNode {
  return isOperatorNode(a) && a.id === OperatorIds.fraction;
}
export class FractionNode implements OperatorNode {
  opts?: NodeOptions;
  /**
   * @param leftChild num
   * @param rightChild denum
   */
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  constructor(
    leftChild: AlgebraicNode,
    rightChild: AlgebraicNode,
    opts?: NodeOptions,
  ) {
    this.id = OperatorIds.fraction;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()}) / (${this.rightChild.toMathString()})`;
  }

  toInversed() {
    return new FractionNode(this.rightChild, this.leftChild);
  }
  toEquivalentNodes(opts?: NodeOptions) {
    const options = opts ?? this.opts;
    const res: AlgebraicNode[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new FractionNode(leftNode, rightNode));
        if (
          options?.allowFractionToDecimal &&
          isNumberNode(leftNode) &&
          isNumberNode(rightNode)
        ) {
          const [num, denum] = [leftNode.value, rightNode.value];
          const decimal = round(num / denum, 12);
          //on ne push pas les non décimaux (limite arbitraire : partie décimale de 12 => non décimal)
          if ((decimal + "").split(".")[1].length > 11) return;
          res.push(new NumberNode(decimal));
        }
      });
    });
    return res;
    //! cas x/2 : doit on créer 1*x/2 ainsi que 0.5*x ??
    //! si le num est un multiplynode, ex x*y/z , est ce qu'on créé x*(y/z), y*(x/z) ??
    //! est ce qu'on gère le placement du moins n'importe où
  }

  toAllValidTexs(opts?: NodeOptions): string[] {
    return this.toEquivalentNodes(opts).map((node) => node.toTex());
  }

  toTex(): string {
    if (
      !this.opts?.allowMinusAnywhereInFraction &&
      (isOppositeNode(this.leftChild) ||
        (isNumberNode(this.leftChild) && this.leftChild.value < 0))
    ) {
      return `-\\frac{${this.leftChild
        .toTex()
        .slice(1)}}{${this.rightChild.toTex()}}`;
    }

    return `\\frac{${this.leftChild.toTex()}}{${this.rightChild.toTex()}}`;
  }
  evaluate(vars: Record<string, number>) {
    return this.leftChild.evaluate(vars) / this.rightChild.evaluate(vars);
  }
  // toMathjs() {
  //   return fraction(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }
}
