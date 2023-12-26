import { complex, evaluate } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { Complex } from "#root/math/complex/complex";
import { NumberNode } from "../numbers/numberNode";
import { VariableNode } from "../variables/variableNode";
import { OppositeNode } from "../functions/oppositeNode";
import { MultiplyNode } from "../operators/multiplyNode";
import { AddNode } from "../operators/addNode";

export class ComplexNode implements Node {
  re: Node;
  im: Node;
  opts?: NodeOptions;
  type: NodeType = NodeType.number;

  constructor(re: Node, im: Node, opts?: NodeOptions) {
    this.re = re;
    this.im = im;
    this.opts = opts;
  }
  toEquivalentNodes(opts?: NodeOptions): Node[] {
    const options = opts ?? this.opts;
    const res: Node[] = [];
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
    if (this.im.toTex() === "0") return this.re.toString();
    if (this.re.toTex() === "0") {
      return new MultiplyNode(this.im, new VariableNode("i")).toTex();
    }
    return new AddNode(
      this.re,
      new MultiplyNode(this.im, new VariableNode("i")),
    ).toTex();
  }

  toMathjs() {
    return complex(evaluate(this.re.toMathjs()), evaluate(this.im.toMathjs()));
  }
  // toComplex() {
  //   return new Complex(this.re, this.im);
  // }
}
