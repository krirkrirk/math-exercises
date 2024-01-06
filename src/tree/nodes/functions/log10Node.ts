// import { log } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { isAbsNode } from "./absNode";
import { AlgebraicNode } from "../algebraicNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { isInt } from "#root/utils/isInt";
import { isPowerNode } from "../operators/powerNode";
import { MultiplyNode } from "../operators/multiplyNode";
import { primeFactors } from "#root/math/utils/arithmetic/primeFactors";
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

  toMathString(): string {
    return `log_{10}(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    if (!this.opts?.allowLnOfOne && tex === "1") {
      return "0";
    }
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
        const factors = primeFactors(value);
        if (factors.length === 1) return this; //isPrime
        if (factors.every((nb) => nb === factors[0])) {
          return new MultiplyNode(
            new NumberNode(factors.length),
            new Log10Node(new NumberNode(factors[0])),
          ).simplify();
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
