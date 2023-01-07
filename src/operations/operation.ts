import { Expression } from "../expression/expression";

export interface Operation {
  tex: string;
  mathApply: Function;
  texApply(a: Expression | string, b: Expression | string): string;
}
