// import { log } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { isAbsNode } from "./absNode";
import { AlgebraicNode } from "../algebraicNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { isInt } from "#root/utils/isInt";
import { isPowerNode } from "../operators/powerNode";
import { MultiplyNode } from "../operators/multiplyNode";
import { primeFactors } from "#root/math/utils/arithmetic/primeFactors";
import { primeDecomposition } from "#root/math/utils/arithmetic/primeDecomposition";
import { maxPowerDecomposition } from "#root/math/utils/arithmetic/maxPowerDecomposition";
export function isLog10Node(a: Node): a is Log10Node {
  return isFunctionNode(a) && a.id === FunctionsIds.log10;
}
export class Log10Node implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  opts?: NodeOptions;
  isNumeric: boolean;
  constructor(child: AlgebraicNode, opts?: NodeOptions) {
    this.id = FunctionsIds.log10;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.log10,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `log_{10}(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    // if (!this.opts?.allowLnOfOne && tex === "1") {
    //   return "0";
    // }
    const shouldntUseBrackets = isAbsNode(this.child);
    if (shouldntUseBrackets) return `\\log${tex}`;
    else return `\\log\\left(${tex}\\right)`;
  }
  // toMathjs() {
  //   return log(this.child.toMathjs());
  // }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new Log10Node(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  simplify(): AlgebraicNode {
    const simplifiedChild = this.child.simplify();
    if (isNumberNode(simplifiedChild)) {
      const value = simplifiedChild.value;
      const log10 = Math.log10(value);
      if (isInt(log10)) return new NumberNode(log10);
      if (isInt(value)) {
        const decomposition = maxPowerDecomposition(value);
        if (decomposition.length === 1) {
          const el = decomposition[0];
          if (el.power === 1) return this; //isPrime
          else
            return new MultiplyNode(
              new NumberNode(el.power),
              new Log10Node(new NumberNode(el.value)),
            );
        } else {
          //! things like log(6) will return themselves
          //! even true for log(12). Should they be simplified into 2ln(2)+ln(3) ?
          return new Log10Node(simplifiedChild);
        }
      }
    }
    //si int il faut voir si on peut écrire a^b
    if (isPowerNode(simplifiedChild)) {
      return new MultiplyNode(
        simplifiedChild.rightChild,
        new Log10Node(simplifiedChild.leftChild),
      ).simplify();
    }
    return this;
  }
  evaluate(vars: Record<string, number>) {
    return Math.log10(this.child.evaluate(vars));
  }
  equals(node: AlgebraicNode): boolean {
    return isLog10Node(node) && node.child.equals(this.child);
  }
}
