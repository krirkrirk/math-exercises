// import { complex, evaluate } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { VariableNode } from "../variables/variableNode";
import { MultiplyNode } from "../operators/multiplyNode";
import { AddNode } from "../operators/addNode";
import { AlgebraicNode } from "../algebraicNode";

export class ComplexNode implements Node {
  re: AlgebraicNode;
  im: AlgebraicNode;
  opts?: NodeOptions;
  type: NodeType = NodeType.number;

  constructor(re: AlgebraicNode, im: AlgebraicNode, opts?: NodeOptions) {
    this.re = re;
    this.im = im;
    this.opts = opts;
  }
  toIdentifiers() {
    return {
      id: NodeIds.complex,
      re: this.re.toIdentifiers(),
      im: this.im.toIdentifiers(),
    };
  }
  toEquivalentNodes(opts?: NodeOptions): AlgebraicNode[] {
    const options = opts ?? this.opts;
    const res: AlgebraicNode[] = [];
    if (this.im.toTex() === "0") {
      return this.re.toEquivalentNodes(options);
    }
    if (this.re.toTex() === "0") {
      return new MultiplyNode(this.im, new VariableNode("i")).toEquivalentNodes(
        options,
      );
    }

    return new AddNode(
      this.re,
      new MultiplyNode(this.im, new VariableNode("i")),
    ).toEquivalentNodes(options);
  }

  toAllValidTexs(opts?: NodeOptions): string[] {
    const options = opts ?? this.opts;
    return this.toEquivalentNodes(options).map((node) => node.toTex());
  }
  toMathString(): string {
    return this.toTex();
  }
  toTex(): string {
    if (this.im.toTex() === "0") return this.re.toTex();
    if (this.re.toTex() === "0") {
      return new MultiplyNode(this.im, new VariableNode("i")).toTex();
    }
    return new AddNode(
      this.re,
      new MultiplyNode(this.im, new VariableNode("i")),
    ).toTex();
  }

  // toMathjs() {
  //   return complex(evaluate(this.re.toMathjs()), evaluate(this.im.toMathjs()));
  // }
  // toComplex() {
  //   return new Complex(this.re, this.im);
  // }
}
