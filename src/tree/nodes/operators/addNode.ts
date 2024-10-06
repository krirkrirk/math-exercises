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
import { colorize } from "#root/utils/latex/colorize";

export function isAddNode(a: Node): a is AddNode {
  return isOperatorNode(a) && a.id === OperatorIds.add;
}

export class AddNode implements CommutativeOperatorNode {
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  opts?: NodeOptions;
  isNumeric: boolean;
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
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
  }
  shuffle = () => {
    if (coinFlip())
      [this.leftChild, this.rightChild] = [this.rightChild, this.leftChild];
  };

  toMathString(): string {
    return `${this.leftChild.toMathString()} + (${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes(opts?: NodeOptions): AlgebraicNode[] {
    const options = opts ?? this.opts;
    const res: AddNode[] = [];

    const addTree: AlgebraicNode[] = [];
    //ce seront des nodes qui ne sont pas des AddNode

    //1: choper le sous arbre de type Non AddNode (ie les enfants nonAddNode des AddNode)
    const recursive = (node: AlgebraicNode) => {
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

  toTex(options?: ToTexOptions): string {
    const opts = this.opts?.toTexOptions ?? options;
    const color = opts?.color;
    const childOpts = { ...opts };
    if (color) childOpts.color = undefined;

    const rightTex = this.rightChild.toTex(childOpts);
    const leftTex = this.leftChild.toTex(childOpts);

    if (rightTex === "0") return colorize(leftTex, color);
    const tex = `${leftTex}${rightTex[0] === "-" ? "" : "+"}${rightTex}`;
    if (this.opts?.forceParenthesis) {
      return colorize(`\\left(${tex}\\right)`, color);
    } else return colorize(tex, color);
  }
  evaluate(vars: Record<string, number>) {
    return this.leftChild.evaluate(vars) + this.rightChild.evaluate(vars);
  }
  // toMathjs() {
  //   return add(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }
  simplify(opts?: SimplifyOptions): AlgebraicNode {
    const leftSimplified = this.leftChild.simplify(opts);
    const rightSimplified = this.rightChild.simplify(opts);
    const copy = new AddNode(leftSimplified, rightSimplified, this.opts);

    /**get externals nodes
     */
    let externals: AlgebraicNode[] = [];
    const recursive = (node: AlgebraicNode) => {
      if (isAddNode(node)) {
        recursive(node.leftChild);
        recursive(node.rightChild);
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
          new AddNode(new MultiplyNode(c, f), new MultiplyNode(e, d)),
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
    return operatorComposition(AddNode, externals);
  }
  toIdentifiers() {
    return {
      id: NodeIds.add,
      leftChild: this.leftChild.toIdentifiers(),
      rightChild: this.rightChild.toIdentifiers(),
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
