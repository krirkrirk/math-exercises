import { Node } from "../tree/nodes/node";
import { NumberNode } from "../tree/nodes/numbers/numberNode";

export enum NumberType {
  Integer,
  Decimal,
  Rational,
  Real,
}
export interface Nombre {
  value: number;
  tex: string;
  type: NumberType;
  toTree: () => Node;
}
