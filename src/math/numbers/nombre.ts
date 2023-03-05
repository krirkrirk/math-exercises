import { Node } from '#root/tree/nodes/node';

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
