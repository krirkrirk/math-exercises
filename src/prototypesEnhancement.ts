import { AlgebraicNode } from "./tree/nodes/algebraicNode";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "./tree/nodes/numbers/infiniteNode";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { VariableNode } from "./tree/nodes/variables/variableNode";
import { toScientific } from "./utils/numberPrototype/toScientific";

declare global {
  interface Number {
    toTree: () => AlgebraicNode;
    frenchify: () => string;
    toScientific: (decimals?: number) => AlgebraicNode;
  }
  interface String {
    toTree: () => AlgebraicNode;
    unfrenchify: () => number;
  }
}

String.prototype.toTree = function (): AlgebraicNode {
  return new VariableNode(this.valueOf());
};
String.prototype.unfrenchify = function (): number {
  return Number(this.valueOf().replace(",", "."));
};
Number.prototype.toTree = function (): AlgebraicNode {
  const value = this.valueOf();
  if (value === Infinity) return PlusInfinityNode;
  if (value === -Infinity) return MinusInfinityNode;
  return new NumberNode(value);
};
Number.prototype.frenchify = function (): string {
  return (this.valueOf() + "").replace(".", ",");
};
Number.prototype.toScientific = function (decimals?: number): AlgebraicNode {
  return toScientific(this.valueOf(), decimals);
};

export {};