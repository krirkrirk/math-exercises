import { parse } from 'mathjs';
import { Node, NodeType } from '../node';

export class VariableNode implements Node {
  name: string;
  type = NodeType.variable;

  constructor(name: string) {
    this.name = name;
  }

  toTex(): string {
    return `${this.name}`;
  }
  toMathString(): string {
    return `${this.name}`;
  }
  toMathjs() {
    return this.name;
  }
  // simplify(): Node {
  //   return this;
  // }
}
