import { Node, NodeIds, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { hasVariableNode } from "../hasVariableNode";

export function isSinNode(a: Node): a is SinNode {
  return isFunctionNode(a) && a.id === FunctionsIds.sin;
}

export class SinNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;

  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.sin;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }
  toIdentifiers() {
    return {
      id: NodeIds.sin,
      child: this.child.toIdentifiers(),
    };
  }
  toMathString(): string {
    return `sin(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\sin\\left(${this.child.toTex()}\\right)`;
  }

  toEquivalentNodes(): AlgebraicNode[] {
    const res: AlgebraicNode[] = [];
    const childNodes = this.child.toEquivalentNodes();
    childNodes.forEach((childNode) => {
      res.push(new SinNode(childNode));
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
      if (!trigoPoint) return new SinNode(simplifiedChild);
      else return trigoPoint.sin;
    } else {
      // Écrire les règles algébriques spécifiques à sin ici
      // Exemples :
      // sin(x + 2π) -> sin(x)
      // sin(-x) -> -sin(x)
    }
    return new SinNode(simplifiedChild);
  }

  evaluate(vars: Record<string, number>) {
    return Math.sin(this.child.evaluate(vars));
  }

  equals(node: AlgebraicNode): boolean {
    return isSinNode(node) && node.child.equals(this.child);
  }
}
