import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { Node, NodeOptions, NodeType } from "../node";

export class DiscretSetNode implements Node {
  type: NodeType;
  opts?: NodeOptions | undefined;
  elements: Node[];
  constructor(elements: Node[]) {
    this.type = NodeType.set;
    this.elements = elements;
  }
  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).map((node) => node.toTex());
  }
  toEquivalentNodes(opts?: NodeOptions) {
    if (this.elements.length === 1) {
      return this.elements[0]
        .toEquivalentNodes(opts)
        .map((node) => new DiscretSetNode([node]));
    }
    //produits cartésiens
    else {
      const cartesians = getCartesiansProducts()
    }
    return [this];
  }

  toMathString() {
    return `{${this.elements.map((el) => el.toTex()).join(";")}}`;
  }
  toMathjs() {
    return `{${this.elements.map((el) => el.toTex()).join(";")}}`;
  }
  toTex() {
    if (!this.elements.length) return `\\emptyset`;
    return `\\left\\{${this.elements
      .map((el) => el.toTex())
      .join(";")}\\right\\}`;
  }
}

export const EmptySet = new DiscretSetNode([]);
