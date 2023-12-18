import { add } from "mathjs";
import { Node, NodeType } from "../node";
import {
  CommutativeOperatorNode,
  OperatorIds,
  OperatorNode,
} from "./operatorNode";
import { coinFlip } from "#root/utils/coinFlip";
import { permute } from "#root/utils/permutations";
import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";

const addNodeToTex = (leftTex: string, rightTex: string) => {
  return `${leftTex}${rightTex[0] === "-" ? "" : "+"}${rightTex}`;
};
export class AddNode implements CommutativeOperatorNode {
  id: OperatorIds;
  leftChild: Node;
  rightChild: Node;
  type: NodeType;

  constructor(leftChild: Node, rightChild: Node) {
    this.id = OperatorIds.add;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
  }
  shuffle = () => {
    if (coinFlip())
      [this.leftChild, this.rightChild] = [this.rightChild, this.leftChild];
  };

  toMathString(): string {
    return `${this.leftChild.toMathString()} + (${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes(): Node[] {
    const res: AddNode[] = [];

    const addTree: Node[] = [];
    //ce seront des nodes qui ne sont pas des AddNode

    //1: choper le sous arbre de type Non AddNode (ie les enfants nonAddNode des AddNode)
    const recursive = (node: Node) => {
      if (node.type === NodeType.operator) {
        const operatorNode = node as OperatorNode;
        if (operatorNode.id === OperatorIds.add) {
          const addNode = operatorNode as AddNode;
          recursive(addNode.leftChild);
          recursive(addNode.rightChild);
        } else addTree.push(node);
      } else addTree.push(node);
    };
    recursive(this);

    //2: pour tous les nodes qui ne sont pas Add, on génère les equiv node
    const equivNodesArr = addTree.map((node) => node.toEquivalentNodes());

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

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(): string {
    const rightTex = this.rightChild.toTex();
    return addNodeToTex(this.leftChild.toTex(), rightTex);
  }
  toMathjs() {
    return add(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}
