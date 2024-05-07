import { AlgebraicNode } from "../algebraicNode";
import { ToTexOptions } from "../node";
import { VariableNode } from "../variables/variableNode";
import { FunctionNode } from "./functionNode";

export class IntegralNode {
  functionNode: FunctionNode;
  lowerBound: AlgebraicNode;
  upperBound: AlgebraicNode;
  variable: VariableNode;

  constructor(
    functionNode: FunctionNode,
    lowerBound: AlgebraicNode,
    upperBound: AlgebraicNode,
    variable: VariableNode,
  ) {
    (this.functionNode = functionNode),
      (this.lowerBound = lowerBound),
      (this.upperBound = upperBound),
      (this.variable = variable);
  }

  toTex(opts?: ToTexOptions): string {
    return `\\int_{${this.lowerBound.toTex()}}^{${this.upperBound.toTex()}} ${this.functionNode.toTex()} \\, d${this.variable.toTex()}`;
  }
}
