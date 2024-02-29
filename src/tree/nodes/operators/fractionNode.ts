// import { fraction } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode, isOperatorNode } from "./operatorNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { FunctionNode, FunctionsIds } from "../functions/functionNode";
import { round } from "#root/math/utils/round";
import { OppositeNode, isOppositeNode } from "../functions/oppositeNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { MultiplyNode, isMultiplyNode } from "./multiplyNode";
import { Rational } from "#root/math/numbers/rationals/rational";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
import { AddNode, isAddNode } from "./addNode";
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
  isNumeric: boolean;
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
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
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
  simplify(opts?: SimplifyOptions): AlgebraicNode {
    const simplifiedNum = this.leftChild.simplify(opts);
    const simplifiedDenum = this.rightChild.simplify(opts);
    const copy = new FractionNode(simplifiedNum, simplifiedDenum, this.opts);
    if (isNumberNode(simplifiedNum) && simplifiedNum.value === 0) {
      return new NumberNode(0);
    }
    if (isNumberNode(simplifiedDenum) && simplifiedDenum.value === 1) {
      return simplifiedNum;
    }
    if (isNumberNode(simplifiedDenum) && simplifiedDenum.value === -1) {
      return new OppositeNode(simplifiedNum).simplify(opts);
    }
    const externalsNums: AlgebraicNode[] = [];
    const externalsDenums: AlgebraicNode[] = [];
    let oppositesCount = 0;

    const recursiveNums = (node: AlgebraicNode) => {
      if (isMultiplyNode(node)) {
        recursiveNums(node.leftChild);
        recursiveNums(node.rightChild);
      } else if (isOppositeNode(node)) {
        oppositesCount++;
        recursiveNums(node.child);
      } else {
        externalsNums.push(node);
      }
    };
    const recursiveDenums = (node: AlgebraicNode) => {
      if (isMultiplyNode(node)) {
        recursiveDenums(node.leftChild);
        recursiveDenums(node.rightChild);
      } else if (isOppositeNode(node)) {
        oppositesCount++;
        recursiveNums(node.child);
      } else {
        externalsDenums.push(node);
      }
    };
    recursiveNums(copy.leftChild);
    recursiveDenums(copy.rightChild);
    if (oppositesCount % 2 === 1) {
      externalsNums.unshift(new NumberNode(-1));
    }
    const simplifyExternalNodes = (
      num: AlgebraicNode,
      denum: AlgebraicNode,
    ) => {
      if (isNumberNode(num) && isNumberNode(denum)) {
        // console.log("num nb, denum nb", num.toTex(), denum.toTex());
        if (denum.value < 0) {
          if (num.value < 0) {
            return new FractionNode(
              new NumberNode(-num.value),
              new NumberNode(-denum.value),
            );
          }
          return new OppositeNode(
            new FractionNode(num, new NumberNode(-denum.value)),
          );
        }
        const frac = new Rational(num.value, denum.value);
        if (frac.isIrreductible()) return null;
        return frac.simplify().toTree();
      }
      if (
        isNumberNode(num) &&
        (isFractionNode(denum) ||
          (isOppositeNode(denum) && isFractionNode(denum.child)))
      ) {
        const trueDenum = isFractionNode(denum)
          ? denum
          : (denum.child as FractionNode);
        return new MultiplyNode(
          num,
          new FractionNode(trueDenum.rightChild, trueDenum.leftChild),
        ).simplify();
      }
      if (
        isNumberNode(denum) &&
        (isFractionNode(num) ||
          (isOppositeNode(num) && isFractionNode(num.child)))
      ) {
        // console.log("num frac, denum nb, ", num.toTex(), denum.toTex());
        const trueNum = isFractionNode(num) ? num : (num.child as FractionNode);
        return new FractionNode(
          trueNum.leftChild,
          new MultiplyNode(trueNum.rightChild, denum),
        ).simplify();
      }
      if (isFractionNode(denum) && isFractionNode(num)) {
        return new MultiplyNode(
          num,
          new FractionNode(denum.rightChild, denum.leftChild),
        ).simplify();
      }
      //!ya mieux à faire pour gérer tous les cas d'un coup
      //! s'insiprer de multiply
      if (num.equals(denum)) return new NumberNode(1);
      return null;
    };
    const simplifyIteration = () => {
      for (let i = 0; i < externalsNums.length; i++) {
        const num = externalsNums[i];
        for (let j = 0; j < externalsDenums.length; j++) {
          const denum = externalsDenums[j];
          const simplified = simplifyExternalNodes(num, denum);
          if (simplified) {
            if (isFractionNode(simplified)) {
              externalsNums[i] = simplified.leftChild;
              externalsDenums[j] = simplified.rightChild;
            } else {
              externalsNums[i] = simplified;
              externalsDenums.splice(j, 1);
            }
            simplifyIteration();
            return;
          }
        }
      }
    };
    simplifyIteration();

    const nums =
      externalsNums.length === 1
        ? externalsNums[0]
        : operatorComposition(MultiplyNode, externalsNums).simplify(opts);
    if (externalsDenums.length === 0) {
      return nums;
    }
    const denums =
      externalsDenums.length === 1
        ? externalsDenums[0]
        : operatorComposition(MultiplyNode, externalsDenums);
    if (opts?.forceDistributeFractions) {
      if (isAddNode(nums)) {
        return new AddNode(
          new FractionNode(nums.leftChild, denums).simplify(opts),
          new FractionNode(nums.rightChild, denums).simplify(opts),
        );
      }
    }
    return new FractionNode(nums, denums);
  }
  equals(node: AlgebraicNode): boolean {
    return (
      isFractionNode(node) &&
      node.leftChild.equals(this.leftChild) &&
      node.rightChild.equals(this.rightChild)
    );
  }
}
