// import { add } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType, ToTexOptions } from "../node";
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
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { isSubstractNode } from "./substractNode";
import { OppositeNode, isOppositeNode } from "../functions/oppositeNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { MultiplyNode, isMultiplyNode } from "./multiplyNode";
import { FractionNode, isFractionNode } from "./fractionNode";
import { shuffle } from "#root/utils/shuffle";

export function isAddNode(a: Node): a is AddNode {
  return isOperatorNode(a) && a.id === OperatorIds.add;
}

export class AddNode implements CommutativeOperatorNode {
  id: OperatorIds;
  children: AlgebraicNode[];
  type: NodeType;
  opts?: NodeOptions;
  isNumeric: boolean;
  constructor(children: AlgebraicNode[], opts?: NodeOptions) {
    this.id = OperatorIds.add;
    this.children = children;
    this.type = NodeType.operator;
    this.opts = opts;
    this.isNumeric = children.every((child) => child.isNumeric);
  }
  shuffle = () => {
    this.children = shuffle(this.children);
  };

  toMathString(): string {
    let s = this.children[0].toMathString();
    for (const child of this.children.slice(1)) {
      s += ` + (${child.toMathString()})`;
    }
    return s;
  }

  toEquivalentNodes(opts?: NodeOptions): AlgebraicNode[] {
    const options = opts ?? this.opts;
    const res: AddNode[] = [];

    const addTree: AlgebraicNode[] = [];
    //ce seront des nodes qui ne sont pas des AddNode

    //1: choper le sous arbre de type Non AddNode (ie les enfants nonAddNode des AddNode)
    //! pourquoi n'exclut-on pas les substractNode ici ?
    const recursive = (node: AlgebraicNode) => {
      if (isOperatorNode(node)) {
        if (isAddNode(node)) {
          node.children.forEach((c) => recursive(c));
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
        if (product.length < 2) return product;
        return new AddNode(product);
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
    let tex = this.children[0].toTex();
    for (const child of this.children.slice(1)) {
      const childTex = child.toTex();
      tex += `${childTex[0] === "-" ? "" : "+"}${childTex}`;
    }
    if (this.opts?.forceParenthesis) {
      return `\\left(${tex}\\right)`;
    } else return tex;
  }
  evaluate(vars: Record<string, number>) {
    return this.children.reduce((acc, curr) => acc + curr.evaluate(vars), 0);
  }
  // toMathjs() {
  //   return add(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }
  simplify(opts?: SimplifyOptions): AlgebraicNode {
    const childrenSimplified = this.children.map((c) => c.simplify(opts));
    const copy = new AddNode(childrenSimplified, this.opts);

    //1 : met dans externals tous les nodes enfant qui ne sont pas Add ou Substract
    //ex : 2+3+4*x +exp(3)+(3+2)/(1+3)+((1+(2+3)) => [2,3,4*x,exp(3),(3+2,1+3),1,2,3]
    let externals: AlgebraicNode[] = [];
    const recursive = (node: AlgebraicNode) => {
      if (isAddNode(node)) {
        node.children.forEach((c) => recursive(c));
      } else if (isSubstractNode(node)) {
        recursive(node.leftChild);
        recursive(new OppositeNode(node.rightChild));
      } else {
        externals.push(node);
      }
    };
    recursive(copy);

    externals = externals.filter(
      (node) => !isNumberNode(node) || node.value !== 0,
    );
    if (!externals.length) return new NumberNode(0);
    if (externals.length === 1) return externals[0];

    const simplifyExternalNodes = (a: AlgebraicNode, b: AlgebraicNode) => {
      if (isFractionNode(a) && isFractionNode(b)) {
        //c/d + e/f   =  cf+ed / df
        const c = a.leftChild;
        const d = a.rightChild;
        const e = b.leftChild;
        const f = b.rightChild;
        return new FractionNode(
          new AddNode([new MultiplyNode(c, f), new MultiplyNode(e, d)]),
          new MultiplyNode(d, f),
        ).simplify(opts);
      }
      if (isFractionNode(a)) {
        //c/d + b
        const c = a.leftChild;
        const d = a.rightChild;
        return new FractionNode(
          new AddNode(c, new MultiplyNode(d, b)),
          d,
        ).simplify(opts);
      }
      if (isFractionNode(b) && !opts?.forceDistributeFractions) {
        //a+c/d
        const c = b.leftChild;
        const d = b.rightChild;
        return new FractionNode(
          new AddNode(c, new MultiplyNode(d, a)),
          d,
        ).simplify(opts);
      }
      if (isNumberNode(a) && isNumberNode(b)) {
        return new NumberNode(a.value + b.value);
      }
      if (isOppositeNode(a) && isNumberNode(a.child) && isNumberNode(b)) {
        return new NumberNode(-a.child.value + b.value);
      }
      if (isOppositeNode(b) && isNumberNode(b.child) && isNumberNode(a)) {
        return new NumberNode(-b.child.value + a.value);
      }
      if (
        isOppositeNode(a) &&
        isNumberNode(a.child) &&
        isOppositeNode(b) &&
        isNumberNode(b.child)
      ) {
        return new NumberNode(a.child.value + b.child.value);
      }
      //gérer opposites, fractions

      if (opts?.forbidFactorize) return null;

      const aSubExternals: AlgebraicNode[] = [];
      const bSubExternals: AlgebraicNode[] = [];
      const getAMultiplyExternals = (a: AlgebraicNode) => {
        if (isMultiplyNode(a)) {
          getAMultiplyExternals(a.leftChild);
          getAMultiplyExternals(a.rightChild);
        } else if (isOppositeNode(a)) {
          //on transofmre les opposites en -1
          aSubExternals.push(new NumberNode(-1));
          getAMultiplyExternals(a.child);
        } else {
          aSubExternals.push(a);
        }
      };
      const getBMultiplyExternals = (b: AlgebraicNode) => {
        if (isMultiplyNode(b)) {
          getBMultiplyExternals(b.leftChild);
          getBMultiplyExternals(b.rightChild);
        } else if (isOppositeNode(b)) {
          //on transofmre les opposites en -1
          bSubExternals.push(new NumberNode(-1));
          getBMultiplyExternals(b.child);
        } else {
          bSubExternals.push(b);
        }
      };
      getAMultiplyExternals(a);
      getBMultiplyExternals(b);

      const factors: AlgebraicNode[] = [];
      for (let i = 0; i < aSubExternals.length; i++) {
        const left = aSubExternals[i];
        for (let j = 0; j < bSubExternals.length; j++) {
          const right = bSubExternals[j];
          if (left.equals(right)) {
            factors.push(left);
            aSubExternals.splice(i, 1);
            bSubExternals.splice(j, 1);
            i--;
            j--;
          }
        }
      }
      //si aucun facteur on return
      if (!factors.length) return null;
      const factorsNode =
        factors.length === 1
          ? factors[0]
          : operatorComposition(MultiplyNode, factors);
      // if (!aSubExternals.length && !bSubExternals.length) return factorsNode;
      const aNode =
        aSubExternals.length === 0
          ? new NumberNode(1)
          : aSubExternals.length === 1
          ? aSubExternals[0]
          : operatorComposition(MultiplyNode, aSubExternals);
      const bNode =
        bSubExternals.length === 0
          ? new NumberNode(1)
          : bSubExternals.length === 1
          ? bSubExternals[0]
          : operatorComposition(MultiplyNode, bSubExternals);
      const addNode = new AddNode(aNode, bNode);
      return new MultiplyNode(addNode, factorsNode).simplify();
    };

    //pour chaque paire on essaye de simplifier,
    //chaque simplification déclenche le reboot du process
    const simplifyIteration = () => {
      for (let i = 0; i < externals.length - 1; i++) {
        const left = externals[i];
        for (let j = i + 1; j < externals.length; j++) {
          const right = externals[j];
          const simplified = simplifyExternalNodes(left, right);
          if (simplified) {
            externals[i] = simplified;
            externals.splice(j, 1);
            if (isNumberNode(simplified) && simplified.value === 0) {
              externals.splice(i, 1);
            }
            simplifyIteration();
            return;
          }
        }
      }
    };
    simplifyIteration();

    if (!externals.length) return new NumberNode(0);
    if (externals.length === 1) return externals[0];
    return new AddNode(externals);
  }
  toIdentifiers() {
    return {
      id: NodeIds.add,
      children: this.children.map((c) => c.toIdentifiers()),
    };
  }
  equals(node: AlgebraicNode): boolean {
    //!incorrect, il faut plutot vérifier qu'ils ont les meme externals
    return (
      isAddNode(node) &&
      ((node.leftChild.equals(this.leftChild) &&
        node.rightChild.equals(this.rightChild)) ||
        (node.leftChild.equals(this.rightChild) &&
          node.rightChild.equals(this.leftChild)))
    );
  }
}
