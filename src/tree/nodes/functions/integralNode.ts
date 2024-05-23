import { AlgebraicNode } from "../algebraicNode";
import { ToTexOptions } from "../node";
import { VariableNode } from "../variables/variableNode";
import { FunctionNode } from "./functionNode";

export class IntegralNode {
  functionNode: AlgebraicNode;
  lowerBound: AlgebraicNode;
  upperBound: AlgebraicNode;
  variable: VariableNode;

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

  toTex(opts?: ToTexOptions): string {
    return `\\int_{${this.lowerBound.toTex()}}^{${this.upperBound.toTex()}} ${this.functionNode.toTex()} \\, \\mathrm{d}${this.variable.toTex()}`;
  }
}
