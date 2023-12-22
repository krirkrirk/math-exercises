import { isIndex, sqrt } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds } from "./functionNode";
import { SquareRoot } from "#root/math/numbers/reals/real";
import { NumberNode } from "../numbers/numberNode";
import { MultiplyNode } from "../operators/multiplyNode";
import { isInt } from "#root/utils/isInt";

export class SqrtNode implements FunctionNode {
  id: FunctionsIds;
  child: Node;
  type: NodeType;
  opts?: NodeOptions;

  constructor(child: Node, opts?: NodeOptions) {
    this.id = FunctionsIds.sqrt;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
  }
  toMathString(): string {
    return `sqr(${this.child.toMathString()})`;
  }
  toMathjs() {
    return sqrt(this.child.toMathjs());
  }
  toTex(): string {
    return `\\sqrt{${this.child.toTex()}}`;
  }

  toEquivalentNodes(opts?: NodeOptions): Node[] {
    const options = opts ?? this.opts;
    const res: Node[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new SqrtNode(childNode));
    });
    if (options?.allowSimplifySqrt && this.child.type === NodeType.number) {
      const operand = this.child as NumberNode;
      const sqrt = new SquareRoot(operand.value);
      const coeffs = sqrt.getSimplifiedCoeffs();
      if (coeffs[0] !== 1) {
        res.push(
          ...new MultiplyNode(
            new NumberNode(coeffs[0]),
            new SqrtNode(new NumberNode(coeffs[1])),
          ).toEquivalentNodes(),
        );
      } else if (isInt(Math.sqrt(coeffs[1]))) {
        res.push(new NumberNode(Math.sqrt(coeffs[1])));
      }
    }
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
}
