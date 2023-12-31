// import { sqrt } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { SquareRoot } from "#root/math/numbers/reals/real";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { MultiplyNode } from "../operators/multiplyNode";
import { isInt } from "#root/utils/isInt";
import { AlgebraicNode } from "../algebraicNode";
export function isSqrtNode(a: Node): a is SqrtNode {
  return isFunctionNode(a) && a.id === FunctionsIds.sqrt;
}
export class SqrtNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  opts?: NodeOptions;

  constructor(child: AlgebraicNode, opts?: NodeOptions) {
    this.id = FunctionsIds.sqrt;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
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
}
