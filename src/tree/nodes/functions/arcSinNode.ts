import { Node, NodeIds, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { hasVariableNode } from "../hasVariableNode";

export function isArcsinNode(a: Node): a is ArcsinNode {
  return isFunctionNode(a) && a.id === FunctionsIds.arcsin;
}

export class ArcsinNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.arcsin;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.arcsin,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `arcsin(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\arcsin\\left(${this.child.toTex()}\\right)`;
  }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new ArcsinNode(childNode));
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  simplify(): AlgebraicNode {
    const simplifiedChild = this.child.simplify();
    if (!hasVariableNode(simplifiedChild)) {
      const value = simplifiedChild.evaluate({});
      const trigoPoint = remarkableTrigoValues.find(
        (remarkableValue) => remarkableValue.sin.evaluate({}) === value,
      );
      if (!trigoPoint) return this;
      else return trigoPoint.angle;
    } else {
      // Écrire les règles algébriques
      // chaque simplification doit relancer tout le simplify
      // arcsin(x)
    }
    return this;
  }

  evaluate(vars: Record<string, number>) {
    return Math.asin(this.child.evaluate(vars));
  }

  equals(node: AlgebraicNode): boolean {
    return isArcsinNode(node) && node.child.equals(this.child);
  }
}
