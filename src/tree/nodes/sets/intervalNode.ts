import { random } from "#root/utils/alea/random";
import { getCartesiansProducts } from "#root/utils/arrays/cartesianProducts";
import { permute } from "#root/utils/arrays/permutations";
import { AlgebraicNode } from "../algebraicNode";
import { InequationNode } from "../inequations/inequationNode";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { NodeIdentifiers } from "../nodeConstructor";
import { isConstantNode } from "../numbers/constantNode";
import {
  MinusInfinityNode,
  PlusInfinityNode,
  isInfiniteNode,
} from "../numbers/infiniteNode";
import { VariableNode } from "../variables/variableNode";
import { Closure, ClosureType } from "./closure";
import { SetIds, SetNode, isSetNode } from "./setNode";
import { UnionIntervalNode } from "./unionIntervalNode";

export function isIntervalNode(a: Node): a is IntervalNode {
  return isSetNode(a) && a.id === SetIds.interval;
}
export type IntervalNodeIdentifiers = {
  id: NodeIds;
  leftChild: NodeIdentifiers;
  rightChild: NodeIdentifiers;
  closure: ClosureType;
  opts?: NodeOptions;
};
export class IntervalNode implements SetNode {
  type: NodeType;
  id: SetIds;
  opts?: NodeOptions | undefined;
  closure: ClosureType;
  a: AlgebraicNode;
  b: AlgebraicNode;
  isEmpty: boolean;
  constructor(
    a: AlgebraicNode,
    b: AlgebraicNode,
    closure: ClosureType,
    opts?: NodeOptions,
  ) {
    this.type = NodeType.set;
    this.id = SetIds.interval;
    this.closure = closure;
    this.a = a;
    this.b = b;
    this.isEmpty = false;
    this.opts = opts;
  }

  toAllValidTexs(opts?: NodeOptions) {
    return this.toEquivalentNodes(opts ?? this.opts).flatMap((node) =>
      node.toAllTexs(opts ?? this.opts),
    );
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

  toInequality(middleChild?: AlgebraicNode) {
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

  toReversedClosure() {
    return new IntervalNode(this.a, this.b, Closure.reverse(this.closure));
  }
  toLeftReversedClosure() {
    return new IntervalNode(this.a, this.b, Closure.leftReverse(this.closure));
  }
  toRightReversedClosure() {
    return new IntervalNode(this.a, this.b, Closure.rightReverse(this.closure));
  }
  toRandomDifferentClosure() {
    if (isInfiniteNode(this.a) && isInfiniteNode(this.b)) return this;
    let closure;
    do {
      const left = isInfiniteNode(this.a) ? "]" : random<"[" | "]">(["[", "]"]);
      const right = isInfiniteNode(this.b)
        ? "["
        : random<"[" | "]">(["[", "]"]);
      closure = Closure.fromBrackets(left, right);
    } while (closure === this.closure);
    return new IntervalNode(this.a, this.b, closure);
  }
  toComplement() {
    if (isInfiniteNode(this.a) && isInfiniteNode(this.b)) return this;
    if (isInfiniteNode(this.a)) {
      return new IntervalNode(
        this.b,
        PlusInfinityNode,
        this.closure === ClosureType.OF ? ClosureType.FO : ClosureType.OO,
      );
    }
    if (isInfiniteNode(this.b)) {
      return new IntervalNode(
        MinusInfinityNode,
        this.a,
        this.closure === ClosureType.FO ? ClosureType.OO : ClosureType.OF,
      );
    }
    const aClosed =
      this.closure === ClosureType.FO || this.closure === ClosureType.FF;
    const bClosed =
      this.closure === ClosureType.FF || this.closure === ClosureType.OF;

    return new UnionIntervalNode([
      new IntervalNode(
        MinusInfinityNode,
        this.a,
        aClosed ? ClosureType.OO : ClosureType.OF,
      ),
      new IntervalNode(
        this.b,
        PlusInfinityNode,
        bClosed ? ClosureType.OO : ClosureType.FO,
      ),
    ]);
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
    return `${left}${this.a.toTex()};${this.b.toTex()}${right}`;
  }
  toAllTexs(opts?: NodeOptions): string[] {
    const res = [this.toTex()];
    if (opts?.allowCommaInInterval) {
      res.push(this.toTex().replace(";", ","));
    }
    return res;
  }
  toIdentifiers(): IntervalNodeIdentifiers {
    return {
      id: NodeIds.interval,
      leftChild: this.a.toIdentifiers(),
      rightChild: this.b.toIdentifiers(),
      closure: this.closure,
      opts: this.opts,
    };
  }

  toText(isPlural: boolean, isFeminine: boolean) {
    const conjugaison = isFeminine ? "e" : "" + isPlural ? "s" : "";
    return isInfiniteNode(this.a)
      ? Closure.isRightOpen(this.closure)
        ? `strictement inférieur${conjugaison} à $${this.b.toTex()}$`
        : `inférieur${conjugaison} à $${this.b.toTex()}$`
      : isInfiniteNode(this.b)
      ? Closure.isLeftOpen(this.closure)
        ? `strictement supérieur${conjugaison} à $${this.a.toTex()}$`
        : `supérieur${conjugaison} à $${this.a.toTex()}$`
      : `compris entre $${this.a.toTex()}$ ${
          Closure.isLeftOpen(this.closure) ? "exclu" : "inclus"
        } et $${this.b.toTex()}$ ${
          Closure.isRightOpen(this.closure) ? "exclu" : "inclus"
        }`;
  }

  simplify() {
    return this;
  }
}
