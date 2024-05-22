import { Node, NodeType, hasVariableNode } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";

export function isTanNode(a: Node): a is TanNode {
  return isFunctionNode(a) && a.id === FunctionsIds.tan;
}

export class TanNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.tan;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }

  toMathString(): string {
    return `tan(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\tan\\left(${this.child.toTex()}\\right)`;
  }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new TanNode(childNode));
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
      const moduled = Math.abs(value % Math.PI); // Tangente est périodique avec une période de PI
      const trigoPoint = remarkableTrigoValues.find(
        (value) => value.angle.evaluate({}) === moduled,
      );
      if (!trigoPoint) return this;
      else return trigoPoint.tan;
    } else {
      //écrire les règles algébriques
      //chaque simplification doit relancer tout le simplify
      //tan(x + PI)
      //tan(-x) = -tan(x)
    }
    return this;
  }

  evaluate(vars: Record<string, number>) {
    return Math.tan(this.child.evaluate(vars));
  }

  equals(node: AlgebraicNode): boolean {
    return isTanNode(node) && node.child.equals(this.child);
  }
}
