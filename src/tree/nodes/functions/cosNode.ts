// import { cos } from "mathjs";
import { Node, NodeType, hasVariableNode } from "../node";
import { FunctionNode, FunctionsIds, isFunctionNode } from "./functionNode";
import { AlgebraicNode } from "../algebraicNode";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
export function isCosNode(a: Node): a is CosNode {
  return isFunctionNode(a) && a.id === FunctionsIds.cos;
}
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

  toMathString(): string {
    return `cos(${this.child.toMathString()})`;
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

  toTex(): string {
    return `\\cos\\left(${this.child.toTex()}\\right)`;
  }

  // toMathjs() {
  //   return cos(this.child.toMathjs());
  // }

  simplify() {
    const simplifiedChild = this.child.simplify();
    if (!hasVariableNode(simplifiedChild)) {
      const value = simplifiedChild.evaluate({});
      const moduled = Math.abs(value % (2 * Math.PI));
      const trigoPoint = remarkableTrigoValues.find(
        (value) => value.angle.evaluate({}) === moduled,
      );
      if (!trigoPoint) return new CosNode(simplifiedChild);
      else return trigoPoint.cos;
    } else {
      //écrire les regles albgeiruqe
      //chaque simplification doit relancer tout le simplify
      //cos(x+2PI)
      //cos(-x)
    }
    console.log("simp c", simplifiedChild.toTex());
    return new CosNode(simplifiedChild);
  }
  evaluate(vars: Record<string, number>) {
    return Math.cos(this.child.evaluate(vars));
  }
  equals(node: AlgebraicNode) {
    return isCosNode(node) && node.child.equals(this.child);
  }
}
