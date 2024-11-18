// import { log } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { isAbsNode } from "./absNode";
import { AlgebraicNode } from "../algebraicNode";
import { MultiplyNode } from "../operators/multiplyNode";
import { isPowerNode } from "../operators/powerNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { isInt } from "#root/utils/isInt";
import { primeFactors } from "#root/math/utils/arithmetic/primeFactors";
import { isExpNode } from "./expNode";
import { maxPowerDecomposition } from "#root/math/utils/arithmetic/maxPowerDecomposition";
export function isLogNode(a: Node): a is LogNode {
  return isFunctionNode(a) && a.id === FunctionsIds.log;
}
export class LogNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  opts?: NodeOptions;
  isNumeric: boolean;
  constructor(child: AlgebraicNode, opts?: NodeOptions) {
    this.id = FunctionsIds.log;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.log,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `log(${this.child.toMathString()})`;
  }

  toTex(): string {
    const tex = this.child.toTex();
    if (!this.opts?.allowLnOfOne && tex === "1") {
      return "0";
    }
    const shouldntUseBrackets = isAbsNode(this.child);
    if (shouldntUseBrackets) return `\\ln${tex}`;
    else return `\\ln\\left(${tex}\\right)`;
  }
  // toMathjs() {
  //   return log(this.child.toMathjs());
  // }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new LogNode(childNode));
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
              new LogNode(new NumberNode(el.value)),
            );
        } else {
          //! things like log(6) will return themselves
          //! even true for log(12). Should they be simplified into 2ln(2)+ln(3) ?
          return new LogNode(simplifiedChild);
        }
      }
    }
    if (isExpNode(simplifiedChild)) {
      return simplifiedChild.child;
    }
    //si int il faut voir si on peut écrire a^b
    if (isPowerNode(simplifiedChild)) {
      return new MultiplyNode(
        simplifiedChild.rightChild,
        new LogNode(simplifiedChild.leftChild),
      ).simplify();
    }
    return this;
  }
  evaluate(vars: Record<string, number>) {
    return Math.log(this.child.evaluate(vars));
  }
  equals(node: AlgebraicNode): boolean {
    return isLogNode(node) && node.child.equals(this.child);
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return new LogNode(this.child.toDetailedEvaluation(vars));
  }
}
