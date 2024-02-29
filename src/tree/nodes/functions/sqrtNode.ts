// import { sqrt } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { SquareRoot } from "#root/math/numbers/reals/real";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { MultiplyNode, isMultiplyNode } from "../operators/multiplyNode";
import { isInt } from "#root/utils/isInt";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
export function isSqrtNode(a: Node): a is SqrtNode {
  return isFunctionNode(a) && a.id === FunctionsIds.sqrt;
}
export class SqrtNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  opts?: NodeOptions;
  isNumeric: boolean;
  constructor(child: AlgebraicNode, opts?: NodeOptions) {
    this.id = FunctionsIds.sqrt;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
    this.isNumeric = child.isNumeric;
  }
  toMathString(): string {
    return `sqr(${this.child.toMathString()})`;
  }
  // toMathjs() {
  //   return sqrt(this.child.toMathjs());
  // }
  toTex(): string {
    return `\\sqrt{${this.child.toTex()}}`;
  }

  toEquivalentNodes(opts?: NodeOptions): AlgebraicNode[] {
    const options = opts ?? this.opts;
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new SqrtNode(childNode));
    });
    if (options?.allowSimplifySqrt && isNumberNode(this.child)) {
      const sqrt = new SquareRoot(this.child.value);
      const coeffs = sqrt.getSimplifiedCoeffs();
      if (isInt(Math.sqrt(coeffs[1]))) {
        res.push(new NumberNode(coeffs[0]));
      } else if (coeffs[0] !== 1) {
        res.push(
          ...new MultiplyNode(
            new NumberNode(coeffs[0]),
            new SqrtNode(new NumberNode(coeffs[1])),
          ).toEquivalentNodes(),
        );
      }
    }
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  evaluate(vars: Record<string, number>) {
    return Math.sqrt(this.child.evaluate(vars));
  }
  simplify(opts?: SimplifyOptions) {
    const simplifiedChild = this.child.simplify(opts);
    const copy = new SqrtNode(simplifiedChild, this.opts);
    const externals: AlgebraicNode[] = [];
    //ex [3, x^2] pour sqrt(3x^2)
    //TODO fractions
    const recursive = (node: AlgebraicNode) => {
      if (isMultiplyNode(node)) {
        recursive(node.leftChild);
        recursive(node.rightChild);
      } else {
        externals.push(node);
      }
    };
    recursive(copy.child);
    const simplifyExternalNodes = (a: AlgebraicNode) => {
      if (isNumberNode(a)) {
        const sqrt = new SquareRoot(a.value);
        return sqrt.simplify().toTree();
      }
      //TODO diviser par 2 les puissances (dont exp)
      return new SqrtNode(a);
    };
    const simplifyIteration = () => {
      for (let i = 0; i < externals.length; i++) {
        const simplified = simplifyExternalNodes(externals[i]);
        externals[i] = simplified;
        return;
      }
    };
    simplifyIteration();

    if (externals.length === 1) return externals[0];
    return operatorComposition(MultiplyNode, externals).simplify(opts);
  }
  equals(node: AlgebraicNode): boolean {
    return isSqrtNode(node) && node.child.equals(this.child);
  }
}
