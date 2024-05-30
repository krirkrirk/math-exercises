import { Node, NodeType, hasVariableNode } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";

export function isArctanNode(a: Node): a is ArctanNode {
  return isFunctionNode(a) && a.id === FunctionsIds.arctan;
}

export class ArctanNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.arctan;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }

  toMathString(): string {
    return `arctan(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\arctan\\left(${this.child.toTex()}\\right)`;
  }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new ArctanNode(childNode));
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
        (remarkableValue) => remarkableValue.tan?.evaluate({}) === value,
      );
      if (!trigoPoint) return this;
      else return trigoPoint.angle;
    } else {
      // Écrire les règles algébriques spécifiques à arctan ici
      // Exemples :
      // arctan(tan(x)) -> x
      // arctan(-x) -> -arctan(x)
    }
    return this;
  }

  evaluate(vars: Record<string, number>) {
    return Math.atan(this.child.evaluate(vars));
  }

  equals(node: AlgebraicNode): boolean {
    return isArctanNode(node) && node.child.equals(this.child);
  }
}
