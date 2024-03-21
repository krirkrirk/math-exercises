import { randint } from "#root/math/utils/random/randint";
import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { permute } from "#root/utils/permutations";
import { AlgebraicNode } from "../algebraicNode";
import { Node, NodeOptions, NodeType } from "../node";
import { MinusInfinityNode } from "../numbers/infiniteNode";
import { ClosureType } from "./closure";
import { IntervalNode } from "./intervalNode";
import { SetIds, SetNode, isSetNode } from "./setNode";

export function isUnionIntervalNode(a: Node): a is UnionIntervalNode {
  return isSetNode(a) && a.id === SetIds.union;
}
export abstract class UnionIntervalNodeBuilder {
  static realMinus(a: AlgebraicNode) {
    return new UnionIntervalNode([
      new IntervalNode(MinusInfinityNode, a, ClosureType.OO),
      new IntervalNode(a, MinusInfinityNode, ClosureType.OO),
    ]);
  }
}
export class UnionIntervalNode implements Node {
  type: NodeType;
  id: SetIds;
  opts?: NodeOptions | undefined;
  sets: SetNode[];
  constructor(sets: SetNode[], opts?: NodeOptions) {
    this.type = NodeType.set;
    this.id = SetIds.union;
    this.sets = sets;
    this.opts = opts;
  }

  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).map((node) => node.toTex());
  }

  toEquivalentNodes(opts?: NodeOptions) {
    const options = opts ?? this.opts;
    const res: UnionIntervalNode[] = [];
    const equivs = this.sets.map((s) => s.toEquivalentNodes(options));
    const cartesians = getCartesiansProducts(equivs);
    cartesians.forEach((product) => {
      const permutations = permute(product);
      permutations.forEach((permutation) =>
        res.push(new UnionIntervalNode(permutation, options)),
      );
    });
    return res;
  }

  toMathString() {
    return this.toTex();
  }

  toMathjs() {
    return this.toTex();
  }

  toTex() {
    return this.sets.map((set) => set.toTex()).join("\\cup\\ ");
  }
}
