import { Node, NodeIds, NodeType } from "../node";

export class PercentNode implements Node {
  value: number;
  type: NodeType;

  constructor(value: number) {
    this.value = value;
    this.type = NodeType.number;
  }

  toMathString(): string {
    return `${this.value}%`;
  }
  toTex(): string {
    return `${(this.value + "").replace(".", ",")}\\%`;
  }
  toMathjs() {
    return this.toMathString();
  }
  toAllValidTexs() {
    return [this.toTex()];
  }
  toIdentifiers() {
    return {
      id: NodeIds.percent,
      value: this.value,
    };
  }
  toEquivalentNodes() {
    return [this];
  }
  simplify() {
    return this;
  }
}
