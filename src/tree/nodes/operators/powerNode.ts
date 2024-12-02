// import { pow } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { MultiplyNode, isMultiplyNode } from "./multiplyNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { isSqrtNode } from "../functions/sqrtNode";

export function isPowerNode(a: Node): a is PowerNode {
  return isOperatorNode(a) && a.id === OperatorIds.power;
}

export function isSquareNode(a: Node): a is SquareNode {
  return isOperatorNode(a) && a.id === OperatorIds.square;
}
export const square = (a: AlgebraicNode | number | string) => {
  const nodeA =
    typeof a === "number" ? a.toTree() : typeof a === "string" ? a.toTree() : a;

  return new SquareNode(nodeA);
};

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
  toIdentifiers() {
    return {
      id: NodeIds.power,
      left: this.leftChild.toIdentifiers(),
      right: this.rightChild.toIdentifiers(),
    };
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
  evaluate(vars?: Record<string, number>) {
    return Math.pow(
      this.leftChild.evaluate(vars),
      this.rightChild.evaluate(vars),
    );
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return new PowerNode(
      this.leftChild.toDetailedEvaluation(vars),
      this.rightChild.toDetailedEvaluation(vars),
    );
  }

  simplify(opts?: SimplifyOptions): AlgebraicNode {
    const leftSimplified = this.leftChild.simplify(opts);
    const rightSimplified = this.rightChild.simplify(opts);
    const copy = new PowerNode(leftSimplified, rightSimplified, this.opts);

    //! temporaire
    if (isNumberNode(rightSimplified) && rightSimplified.value === 0) {
      return new NumberNode(1);
    }
    if (isNumberNode(rightSimplified) && rightSimplified.value === 1) {
      return leftSimplified;
    }
    if (isPowerNode(leftSimplified)) {
      return new PowerNode(
        leftSimplified.leftChild,
        new MultiplyNode(rightSimplified, leftSimplified.rightChild).simplify(
          opts,
        ),
      ).simplify(opts);
    }
    if (
      isSqrtNode(leftSimplified) &&
      isNumberNode(rightSimplified) &&
      rightSimplified.value === 2
    ) {
      return leftSimplified.child;
    }
    if (isMultiplyNode(leftSimplified)) {
      return new MultiplyNode(
        new PowerNode(leftSimplified.leftChild, rightSimplified),
        new PowerNode(leftSimplified.rightChild, rightSimplified),
      ).simplify(opts);
    }
    if (
      !opts?.keepPowers &&
      isNumberNode(copy.rightChild) &&
      copy.rightChild.value === 2
    ) {
      return new MultiplyNode(copy.leftChild, copy.leftChild).simplify(opts);
    }
    return copy;
  }

  equals(node: AlgebraicNode): boolean {
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
    this.id = OperatorIds.square;
  }
}
