// import { sin } from "mathjs";
import { Node, NodeType, hasVariableNode } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
export function isSinNode(a: Node): a is SinNode {
  return isFunctionNode(a) && a.id === FunctionsIds.sin;
}
export class SinNode implements FunctionNode {
  id: FunctionsIds;
  child: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  constructor(child: AlgebraicNode) {
    this.id = FunctionsIds.opposite;
    this.child = child;
    this.type = NodeType.function;
    this.isNumeric = child.isNumeric;
  }

  toMathString(): string {
    return `sin(${this.child.toMathString()})`;
  }

  toTex(): string {
    return `\\sin\\left(${this.child.toTex()}\\right)`;
  }
  // toMathjs() {
  //   return sin(this.child.toMathjs());
  // }
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

  simplify(): AlgebraicNode {
    const simplifiedChild = this.child.simplify();
    if (!hasVariableNode(simplifiedChild)) {
      const value = simplifiedChild.evaluate({});
      const moduled = Math.abs(value % (2 * Math.PI));
      const trigoPoint = remarkableTrigoValues.find(
        (value) => value.angle.evaluate({}) === moduled,
      );
      if (!trigoPoint) return this;
      else return trigoPoint.cos;
    } else {
      //écrire les regles albgeiruqe
      //chaque simplification doit relancer tout le simplify
      //cos(x+2PI)
      //cos(-x)
    }
    return this;
  }
  evaluate(vars: Record<string, number>) {
    return Math.sin(this.child.evaluate(vars));
  }
  equals(node: AlgebraicNode): boolean {
    return isSinNode(node) && node.child.equals(this.child);
  }
}
