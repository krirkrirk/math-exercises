import { Node, NodeType } from '../node';

export class VariableNode implements Node {
  name: string;
  type = NodeType.variable;

  constructor(name: string) {
    if (name.length !== 1 || !name.match('[a-zA-Z]')) throw Error('variable must be a letter');
    this.name = name;
  }

  toTex(): string {
    return `${this.name}`;
  }
  toMathString(): string {
    return `${this.name}`;
  }
}
