import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { permute } from "#root/utils/permutations";
import { Node, NodeOptions, NodeType } from "../node";
import { SetIds, SetNode, isSetNode } from "./setNode";
export function isUnionIntervalNode(a: Node): a is DiscreteSetNode {
  return isSetNode(a) && a.id === SetIds.discrete;
}
export class DiscreteSetNode implements SetNode {
  type: NodeType;
  id: SetIds;
  opts?: NodeOptions | undefined;
  elements: Node[];
  constructor(elements: Node[], opts?: NodeOptions) {
    this.type = NodeType.set;
    this.id = SetIds.discrete;
    this.elements = elements;
    this.opts = opts;
  }
  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).map((node) => node.toTex());
  }
  toEquivalentNodes(opts?: NodeOptions) {
    if (this.elements.length === 0) return [this];
    if (this.elements.length === 1) {
      return this.elements[0]
        .toEquivalentNodes(opts ?? this.opts)
        .map((node) => new DiscreteSetNode([node]));
    }
    //produits cartésiens
    else {
      const res: DiscreteSetNode[] = [];
      const equivNodesArr = this.elements.map((node) =>
        node.toEquivalentNodes(opts ?? this.opts),
      );
      //!pas opti car si [2,3,3] alors les 3 se permutent et donc double sortie [2,3_1,3_2], [2,3_2,3_1]
      let equivNodesPermutations = permute(equivNodesArr);
      equivNodesPermutations.forEach((permutation) => {
        const cartesiansProducts = getCartesiansProducts(permutation);
        cartesiansProducts.forEach((product) => {
          res.push(new DiscreteSetNode(product));
        });
      });
      return res;
    }
  }

  toMathString() {
    return `{${this.elements.map((el) => el.toTex()).join(";")}}`;
  }
  toMathjs() {
    return `{${this.elements.map((el) => el.toTex()).join(";")}}`;
  }
  toTex() {
    if (!this.elements.length) return `\\varnothing`;
    return `\\left\\{${this.elements
      .map((el) => el.toTex())
      .join(";")}\\right\\}`;
  }
}

export const EmptySet = new DiscreteSetNode([]);
