import { add } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import {
  CommutativeOperatorNode,
  OperatorIds,
  OperatorNode,
  isOperatorNode,
} from "./operatorNode";
import { coinFlip } from "#root/utils/coinFlip";
import { permute } from "#root/utils/permutations";
import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
import { AlgebraicNode } from "../algebraicNode";

export function isAddNode(a: Node): a is AddNode {
  return isOperatorNode(a) && a.id === OperatorIds.add;
}

const addNodeToTex = (leftTex: string, rightTex: string) => {
  return `${leftTex}${rightTex[0] === "-" ? "" : "+"}${rightTex}`;
};
export class AddNode implements CommutativeOperatorNode {
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  opts?: NodeOptions;
  constructor(
    leftChild: AlgebraicNode,
    rightChild: AlgebraicNode,
    opts?: NodeOptions,
  ) {
    this.id = OperatorIds.add;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
  }
  shuffle = () => {
    if (coinFlip())
      [this.leftChild, this.rightChild] = [this.rightChild, this.leftChild];
  };

  toMathString(): string {
    return `${this.leftChild.toMathString()} + (${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes(opts?: NodeOptions): Node[] {
    const options = opts ?? this.opts;
    const res: AddNode[] = [];

    const addTree: Node[] = [];
    //ce seront des nodes qui ne sont pas des AddNode

    //1: choper le sous arbre de type Non AddNode (ie les enfants nonAddNode des AddNode)
    const recursive = (node: Node) => {
      if (isOperatorNode(node)) {
        if (isAddNode(node)) {
          recursive(node.leftChild);
          recursive(node.rightChild);
        } else addTree.push(node);
      } else addTree.push(node);
    };
    recursive(this);

    //2: pour tous les nodes qui ne sont pas Add, on génère les equiv node
    const equivNodesArr = addTree.map((node) =>
      node.toEquivalentNodes(options),
    );

    //3: créer toutes les permutations de tous kes nodes equiv
    let equivNodesPermutations = permute(equivNodesArr);
    equivNodesPermutations.forEach((permutation) => {
      //4: créé les produits cartésiens des nodes equiv puis nodify
      const cartesiansProducts = getCartesiansProducts(permutation);
      cartesiansProducts.forEach((product) => {
        res.push(operatorComposition(AddNode, product));
      });
    });

    return res;
  }

  toAllTexs(): string[] {
    return [this.toTex()];
  }

  toAllValidTexs(opts?: NodeOptions): string[] {
    const options = opts ?? this.opts;
    return this.toEquivalentNodes(options).map((node) => node.toTex());
  }

  toTex(): string {
    const rightTex = this.rightChild.toTex();
    return addNodeToTex(this.leftChild.toTex(), rightTex);
  }
  toMathjs() {
    return add(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
