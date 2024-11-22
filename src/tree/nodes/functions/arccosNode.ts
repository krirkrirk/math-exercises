import { Node, NodeIds, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { hasVariableNode } from "../hasVariableNode";

export function isArccosNode(a: Node): a is ArccosNode {
  return isFunctionNode(a) && a.id === FunctionsIds.arccos;
}

export class ArccosNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.arccos;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.arccos,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `arccos(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\arccos\\left(${this.child.toTex()}\\right)`;
  }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new ArccosNode(childNode));
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
        (remarkableValue) => remarkableValue.cos.evaluate({}) === value,
      );
      if (!trigoPoint) return this;
      else return trigoPoint.angle;
    } else {
      // Écrire les règles algébriques spécifiques à arccos ici
      // Exemples :
      // arccos(cos(x)) -> x
      // arccos(-x) -> π - arccos(x)
    }
    return this;
  }

  evaluate(vars?: Record<string, number>) {
    return Math.acos(this.child.evaluate(vars));
  }

  equals(node: AlgebraicNode): boolean {
    return isArccosNode(node) && node.child.equals(this.child);
  }
  toDetailedEvaluation(vars: Record<string, AlgebraicNode>) {
    return new ArccosNode(this.child.toDetailedEvaluation(vars));
  }
}
