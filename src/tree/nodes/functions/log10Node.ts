// import { log } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { isAbsNode } from "./absNode";
import { AlgebraicNode } from "../algebraicNode";
export function isLog10Node(a: Node): a is Log10Node {
  return isFunctionNode(a) && a.id === FunctionsIds.log10;
}
export class Log10Node implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  opts?: NodeOptions;

  constructor(child: AlgebraicNode, opts?: NodeOptions) {
    this.id = FunctionsIds.log10;
    this.child = child;
    this.type = NodeType.function;
    this.opts = opts;
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
  simplify(): Node {
    return this;
  }
  evaluate(vars: Record<string, number>) {
    return Math.log10(this.child.evaluate(vars));
  }
}
