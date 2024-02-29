import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { permute } from "#root/utils/permutations";
import { InequationNode } from "../inequations/inequationNode";
import { Node, NodeOptions, NodeType } from "../node";
import { isConstantNode } from "../numbers/constantNode";
import { VariableNode } from "../variables/variableNode";
import { SetIds, SetNode, isSetNode } from "./setNode";

export enum ClosureType {
  FF,
  FO,
  OF,
  OO,
}
export const closureFromBrackets = (left: "[" | "]", right: "]" | "[") => {
  if (left === "[")
    if (right === "]") return ClosureType.FF;
    else return ClosureType.FO;
  else if (right === "[") return ClosureType.OO;
  else return ClosureType.OF;
};
export function isIntervalNode(a: Node): a is IntervalNode {
  return isSetNode(a) && a.id === SetIds.interval;
}
export class IntervalNode implements SetNode {
  type: NodeType;
  id: SetIds;
  opts?: NodeOptions | undefined;
  closure: ClosureType;
  a: Node;
  b: Node;
  constructor(a: Node, b: Node, closure: ClosureType, opts?: NodeOptions) {
    this.type = NodeType.set;
    this.id = SetIds.interval;
    this.closure = closure;
    this.a = a;
    this.b = b;
    this.opts = opts;
  }

  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).map((node) => node.toTex());
  }

  toEquivalentNodes(opts?: NodeOptions) {
    const res: IntervalNode[] = [];
    const equivs = [
      this.a.toEquivalentNodes(opts ?? this.opts),
      this.b.toEquivalentNodes(opts ?? this.opts),
    ];
    const cartesians = getCartesiansProducts(equivs);
    cartesians.forEach((product) => {
      res.push(
        new IntervalNode(
          product[0],
          product[1],
          this.closure,
          opts ?? this.opts,
        ),
      );
    });
    return res;
  }

  toInequality(middleChild?: Node) {
    let middle = middleChild ?? new VariableNode("x");
    if (isConstantNode(this.a) && this.a.tex.includes("infty")) {
      return new InequationNode(
        [middle, this.b],
        this.closure === ClosureType.OF ? "\\le" : "<",
      );
    }
    if (isConstantNode(this.b) && this.b.tex.includes("infty")) {
      return new InequationNode(
        [middle, this.a],
        this.closure === ClosureType.FO ? "\\ge" : ">",
      );
    }
    const leftSymbol =
      this.closure === ClosureType.FO || this.closure === ClosureType.FF
        ? "\\le"
        : "<";
    const rightSymbol =
      this.closure === ClosureType.FF || this.closure === ClosureType.OF
        ? "\\le"
        : "<";

    return new InequationNode(
      [this.a, middle, this.b],
      [leftSymbol, rightSymbol],
    );
  }
  toMathString() {
    return this.toTex();
  }

  toMathjs() {
    return this.toTex();
  }

  toTex() {
    const left =
      this.closure === ClosureType.FF || this.closure === ClosureType.FO
        ? "["
        : "]";
    const right =
      this.closure === ClosureType.FF || this.closure === ClosureType.OF
        ? "]"
        : "[";
    return `${left}\\ ${this.a.toTex()};${this.b.toTex()}\\ ${right}\\ `;
  }
}
