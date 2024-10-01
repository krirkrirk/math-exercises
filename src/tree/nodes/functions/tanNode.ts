import { Node, NodeIds, NodeType } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { hasVariableNode } from "../hasVariableNode";

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
  toIdentifiers() {
    return {
      id: NodeIds.tan,
      child: this.child.toIdentifiers(),
    };
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

  simplify(opts: SimplifyOptions = {}): AlgebraicNode {
    const simplifiedChild = this.child.simplify();
    if (!hasVariableNode(simplifiedChild)) {
      let value = simplifiedChild.evaluate({});
      if (opts.isDegree) {
        value = (value * Math.PI) / 180;
      }
      const moduled = Math.abs(value % Math.PI);
      const trigoPoint = remarkableTrigoValues.find(
        (val) => val.angle.evaluate({}) === moduled,
      );
      if (!trigoPoint) return new TanNode(simplifiedChild);
      else return trigoPoint.tan;
    } else {
      // Écrire les règles algébriques spécifiques à tan ici
      // Exemples :
      // tan(x + π) -> tan(x)
      // tan(-x) -> -tan(x)
    }
    return new TanNode(simplifiedChild);
  }

  evaluate(vars: Record<string, number>) {
    return Math.tan(this.child.evaluate(vars));
  }

  equals(node: AlgebraicNode): boolean {
    return isTanNode(node) && node.child.equals(this.child);
  }
}
