export enum ExpressionType {
  real,
  affine,
  polynomial,
}

export interface Expression {
  // type: ExpressionType;
  add(expression: Expression): Expression;
  multiply(expression: Expression): Expression;
  opposite(): Expression;
  toTex(): string;
}
