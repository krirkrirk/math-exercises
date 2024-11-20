import { AlgebraicNode } from "../algebraicNode";
import { Node, NodeIds, NodeOptions, NodeType, ToTexOptions } from "../node";
import { VariableNode } from "../variables/variableNode";
import { FunctionNode } from "./functionNode";

export class IntegralNode implements Node {
  functionNode: AlgebraicNode;
  lowerBound: AlgebraicNode;
  upperBound: AlgebraicNode;
  variable: VariableNode;
  type = NodeType.function;
  constructor(
    functionNode: AlgebraicNode,
    lowerBound: AlgebraicNode,
    upperBound: AlgebraicNode,
    variable: string,
  ) {
    (this.functionNode = functionNode),
      (this.lowerBound = lowerBound),
      (this.upperBound = upperBound),
      (this.variable = new VariableNode(variable));
  }
  toIdentifiers() {
    return {
      id: NodeIds.integral,
      functionNode: this.functionNode.toIdentifiers(),
      lowerBound: this.lowerBound.toIdentifiers(),
      upperBound: this.upperBound.toIdentifiers(),
      variable: this.variable,
    };
  }
  toTex(opts?: ToTexOptions): string {
    return `\\int_{${this.lowerBound.toTex()}}^{${this.upperBound.toTex()}} ${this.functionNode.toTex()} \\, \\mathrm{d}${this.variable.toTex()}`;
  }
  toMathString() {
    return `intergral(${this.functionNode.toMathString()}, ${this.lowerBound.toMathString()}, ${this.upperBound.toMathString()}, ${this.variable.toMathString()})`;
  }
  toEquivalentNodes() {
    return [this];
  }
  toAllValidTexs() {
    return [this.toTex()];
  }
  simplify() {
    return this;
  }
}
