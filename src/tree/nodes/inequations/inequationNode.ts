import {
  InegalitySymbols,
  InequationSymbol,
} from "#root/math/inequations/inequation";
import { getCartesiansProducts } from "#root/utils/arrays/cartesianProducts";
import { isLetter } from "#root/utils/strings/isLetter";
import { random } from "#root/utils/alea/random";
import e from "express";
import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { MinusInfinityNode, PlusInfinityNode } from "../numbers/infiniteNode";
import { ClosureType } from "../sets/closure";
import { IntervalNode } from "../sets/intervalNode";
import { AlgebraicNode } from "../algebraicNode";

export class InequationNode implements Node {
  opts?: NodeOptions | undefined;
  type: NodeType;
  tex: string;
  children: AlgebraicNode[];
  symbols: InegalitySymbols[];
  constructor(
    children: AlgebraicNode[],
    symbols: InegalitySymbols[] | InegalitySymbols,
  ) {
    if (children.length < 2)
      throw Error("can't build inequality with unique child");
    if (Array.isArray(symbols) && symbols.length !== children.length - 1)
      throw Error("symbols not in adequation with children");
    this.children = children;
    this.symbols = Array.isArray(symbols)
      ? symbols
      : this.children.slice(1).map((el) => symbols);
    this.tex = "";
    for (let i = 0; i < children.length; i++) {
      this.tex += children[i].toTex();
      if (i < children.length - 1) {
        const shouldAddSpace =
          (this.symbols[i] === "\\le" || this.symbols[i] === "\\ge") &&
          isLetter(children[i + 1].toTex());

        this.tex += `${this.symbols[i]}${shouldAddSpace ? " " : ""}`;
      }
    }
    this.type = NodeType.inequation;
  }
  toIdentifiers() {
    return {
      id: NodeIds.inequation,
      children: this.children.map((e) => e.toIdentifiers()),
      symbols: this.symbols,
    };
  }
  toInterval() {
    if (this.children.length > 3)
      throw Error("can't build interval with this inequality");
    if (this.children.length === 3) {
      const closure =
        this.symbols[0] === "<"
          ? this.symbols[1] === "<"
            ? ClosureType.OO
            : ClosureType.OF
          : this.symbols[1] === "<"
          ? ClosureType.FO
          : ClosureType.FF;
      return new IntervalNode(this.children[0], this.children[2], closure);
    } else {
      let leftIsInf = false;
      let rightIsInf = false;
      let closure: ClosureType;
      switch (this.symbols[0]) {
        case "<":
          closure = ClosureType.OO;
          leftIsInf = true;
          break;
        case ">":
          closure = ClosureType.OO;
          rightIsInf = true;
          break;
        case "\\le":
          closure = ClosureType.OF;
          leftIsInf = true;

          break;
        case "\\ge":
          closure = ClosureType.FO;
          rightIsInf = true;
          break;
        default:
          throw Error("unrecognized inequation type");
      }
      return new IntervalNode(
        leftIsInf ? MinusInfinityNode : this.children[1],
        rightIsInf ? PlusInfinityNode : this.children[1],
        closure,
      );
    }
  }
  toReversed() {
    const newChildren = [...this.children].reverse();
    const newSymbols = this.symbols.map((el) =>
      new InequationSymbol(el).reversed(),
    );

    return new InequationNode(newChildren, newSymbols);
  }
  toAllValidTexs() {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }
  toEquivalentNodes(opts?: NodeOptions | undefined) {
    const equivs = this.children.map((node) => node.toEquivalentNodes());
    const cartesians = getCartesiansProducts(equivs);
    const nodes: InequationNode[] = [];
    cartesians.forEach((product) => {
      const newNode = new InequationNode(product, this.symbols);
      const reversed = newNode.toReversed();
      nodes.push(newNode);
      nodes.push(reversed);
    });
    return nodes;
  }
  toMathString() {
    return this.tex;
  }
  toMathjs() {
    return this.tex;
  }
  toAllTexs() {
    return [this.toTex()];
  }
  toTex() {
    return this.tex;
  }
  simplify() {
    return this;
  }
}
