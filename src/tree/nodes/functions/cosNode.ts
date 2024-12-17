import { Node, NodeIds, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { hasVariableNode } from "../hasVariableNode";

export function isCosNode(a: Node): a is CosNode {
  return isFunctionNode(a) && a.id === FunctionsIds.cos;
}

export const cos = (a: AlgebraicNode | number | string) => {
  const nodeA =
    typeof a === "number" ? a.toTree() : typeof a === "string" ? a.toTree() : a;
  return new CosNode(nodeA);
};

export class CosNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.cos;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.cos,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `cos(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\cos\\left(${this.child.toTex()}\\right)`;
  }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new CosNode(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  simplify(opts: SimplifyOptions = {}): AlgebraicNode {
    const simplifiedChild = this.child.simplify();
    if (!hasVariableNode(simplifiedChild)) {
      let value = simplifiedChild.evaluate({});
      if (opts.isDegree) {
        value = (value * Math.PI) / 180;
      }
      const moduled = Math.abs(value % (2 * Math.PI));
      const trigoPoint = remarkableTrigoValues.find(
        (val) => val.angle.evaluate({}) === moduled,
      );
      if (!trigoPoint) return new CosNode(simplifiedChild);
      else return trigoPoint.sin;
    } else {
      // Écrire les règles algébriques spécifiques à sin ici
      // Exemples :
      // sin(x + 2π) -> sin(x)
      // sin(-x) -> -sin(x)
    }
    return new CosNode(simplifiedChild);
  }

  evaluate(vars?: Record<string, number>) {
    return Math.cos(this.child.evaluate(vars));
  }

  equals(node: AlgebraicNode): boolean {
    return isCosNode(node) && node.child.equals(this.child);
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return new CosNode(this.child.toDetailedEvaluation(vars));
  }
  derivative(varName?: string | undefined): AlgebraicNode {
    throw new Error("unimplemented derivative");
  }
}
