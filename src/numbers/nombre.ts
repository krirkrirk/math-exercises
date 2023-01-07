import { Node } from "../tree/nodes/node";
import { NumberNode } from "../tree/nodes/numbers/numberNode";

export enum NumberType {
  Integer,
  Rational,
  Real,
}
export interface Nombre {
  value: number;
  tex: string;
  toTree: () => Node;
}
