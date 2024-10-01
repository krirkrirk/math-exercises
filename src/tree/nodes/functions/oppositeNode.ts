// import { unaryMinus } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import {
  OperatorIds,
  OperatorNode,
  isOperatorNode,
} from "../operators/operatorNode";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { MultiplyNode, isMultiplyNode } from "../operators/multiplyNode";
import { DivideNode, isDivideNode } from "../operators/divideNode";
import { FractionNode, isFractionNode } from "../operators/fractionNode";
import { getCartesiansProducts } from "#root/utils/cartesianProducts";
import { permute } from "#root/utils/permutations";
export function isOppositeNode(a: Node): a is OppositeNode {
  return isFunctionNode(a) && a.id === FunctionsIds.opposite;
}

const getEquivalentTrees = (root: Node) => {};
export class OppositeNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  opts?: NodeOptions;
  isNumeric: boolean;
  constructor(child: AlgebraicNode, opts?: NodeOptions) {
    this.id = FunctionsIds.opposite;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.opposite,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `-(${this.child.toMathString()})`;
  }
  toTex(): string {
    let childTex = this.child.toTex();
    let needBrackets = childTex[0] === "-";
    if (isOperatorNode(this.child)) {
      needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(
        this.child.id,
      );
    }
    if (isNumberNode(this.child) && childTex[0] === "-") {
      return childTex.substring(1);
    }
    if (needBrackets) childTex = `\\left(${childTex}\\right)`;
    return `-${childTex}`;
  }

  toEquivalentNodes(opts?: NodeOptions): AlgebraicNode[] {
    const options = opts ?? this.opts;
    const res: AlgebraicNode[] = [];
    const externalNodes: AlgebraicNode[] = [];
    //! est ce qu'il faut faire ici des simplifications du type -ln(2) => 1/ln(2)
    //! ou meme -(a+b) => -a - b

    //!version simplifiée pour juste gérer les fractions
    //!la bonne solution serait de parse l'arbre et déplacer l'opposite sur chaque child d'un sous arbre multiplicatif
    const childNodes = this.child.toEquivalentNodes(options);
    childNodes.forEach((childNode) => {
      res.push(new OppositeNode(childNode));
      if (isFractionNode(childNode)) {
        res.push(
          new FractionNode(
            new OppositeNode(childNode.leftChild),
            childNode.rightChild,
            { allowMinusAnywhereInFraction: true },
          ),
          new FractionNode(
            childNode.leftChild,
            new OppositeNode(childNode.rightChild),
            { allowMinusAnywhereInFraction: true },
          ),
        );
      }
    });
    // }

    return res;
  }

  /**
   * start opposite node
   * find all external child of multiply and fraction nodes
   * add opposite to them
   */
  toAllValidTexs(opts?: NodeOptions): string[] {
    const options = opts ?? this.opts;
    return this.toEquivalentNodes(options).map((node) => node.toTex());
  }

  // toMathjs() {
  //   return unaryMinus(this.child.toMathjs());
  // }
  evaluate(vars: Record<string, number>) {
    return -this.child.evaluate(vars);
  }
  simplify(opts?: SimplifyOptions) {
    if (isNumberNode(this.child)) return new NumberNode(-this.child.value);
    return new MultiplyNode(new NumberNode(-1), this.child).simplify(opts);
  }
  equals(node: AlgebraicNode): boolean {
    return isOppositeNode(node) && node.child.equals(this.child);
  }
}
