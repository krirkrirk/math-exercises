import { operationsPriorities } from "./exercises/calcul/operationsPriorities";
import { exercises } from "./exercises/exercises";
import { latexParser } from "./tree/parsers/latexParser";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { Polynomial } from "./polynomials/polynomial";
import { derivateParser } from "./tree/parsers/derivateParser";

// exercises.forEach((exo) => {
//   console.log(exo.instruction, exo.generator(10));
// });

const pol = new Polynomial([2, 3, 1, 4]);
export { exercises };
