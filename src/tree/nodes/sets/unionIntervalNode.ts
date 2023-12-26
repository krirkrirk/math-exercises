import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { permute } from "#root/utils/permutations";
import { Node, NodeOptions, NodeType } from "../node";
import { SetNode } from "./setNode";

export enum ClosureType {
  FF,
  FO,
  OF,
  OO,
}

export class UnionIntervalNode implements Node {
  type: NodeType;
  opts?: NodeOptions | undefined;
  sets: SetNode[];
  constructor(sets: SetNode[], opts?: NodeOptions) {
    this.type = NodeType.set;
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
    return this.sets.map((set) => set.toTex()).join("\\cup");
  }
}
