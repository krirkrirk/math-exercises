import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { Nombre, NumberType } from '../nombre';

export class Real implements Nombre {
  value: number;
  tex: string;
  type: NumberType;
  constructor(value: number, tex: string) {
    this.value = value;
    this.tex = tex;
    this.type = NumberType.Real;
  }
  toTree(): Node {
    return new NumberNode(this.value);
  }
}
