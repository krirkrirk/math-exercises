import { ToTexOptions } from "../node";
import { VariableNode } from "../variables/variableNode";
import { FunctionNode } from "./functionNode";

export class IntegralNode {
  constructor(
    public functionNode: FunctionNode,
    public lowerBound: number,
    public upperBound: number,
    public variable: VariableNode,
  ) {}

  toTex(opts?: ToTexOptions): string {
    const displayStyle = opts?.displayStyle ?? true;
    return `\\int_{${this.lowerBound}}^{${
      this.upperBound
    }} ${this.functionNode.toTex()} \\, d${this.variable.toTex()}`;
  }
}
