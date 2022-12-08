export enum ExpressionType {
  polynomial,
}

export interface Expression {
  add(expression: Expression): Expression;
  opposite(): Expression;
  toTex(): string;
}
