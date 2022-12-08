import { Expression } from "../expression/expression";
import { Operation } from "./operation";

export const add: Operation = {
  tex: "+",
  apply: (a: Expression, b: Expression): Expression => {
    return a.add(b);
  },
};
