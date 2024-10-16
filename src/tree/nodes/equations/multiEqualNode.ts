import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { permute } from "#root/utils/arrays/permutations";
import { getCartesiansProducts } from "#root/utils/arrays/cartesianProducts";

export class MultiEqualNode implements Node {
  children: Node[];
  opts?: NodeOptions;
  type: NodeType;
  constructor(children: Node[], opts?: NodeOptions) {
    this.children = children;
    this.type = NodeType.equality;
    this.opts = opts;
  }

  toEquivalentNodes() {
    const res: MultiEqualNode[] = [];
    const equivs = this.children.map((node) => node.toEquivalentNodes());
    const cartesians = getCartesiansProducts(equivs);
    cartesians.forEach((product) => {
      res.push(new MultiEqualNode(product));
    });
    return res;
  }

  toIdentifiers() {
    return {
      id: NodeIds.multiEqual,
      children: this.children.map((e) => e.toIdentifiers()),
    };
  }
  toAllTexs() {
    const permutations = permute(this.children);
    return permutations.flatMap(
      (permutation) => `${permutation.map((node) => node.toTex()).join("=")}`,
    );
  }
  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().flatMap((node) => node.toAllTexs());
  }

  toMathString(): string {
    return this.toTex();
  }
  toTex(): string {
    return `${this.children.map((node) => node.toTex()).join("=")}`;
  }

  toMathjs() {
    return this.toTex();
  }
}
