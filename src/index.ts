import { operationsPriorities } from "./exercises/calcul/operations/operationsPriorities";
import { exercises } from "./exercises/exercises";
import { latexParser } from "./tree/parsers/latexParser";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { Polynomial } from "./polynomials/polynomial";
import { derivateParser } from "./tree/parsers/derivateParser";
import { midpoint } from "./exercises/geometry/cartesian/midpoint";
import { factoType1Exercise } from "./exercises/calculLitteral/factorisation/factoType1Exercise";
import { scalarProductViaCoords } from "./exercises/geometry/vectors/scalarProductViaCoords";

// exercises.forEach((exo) => {
//   console.log(exo.instruction, exo.generator(10));
// });
console.log(scalarProductViaCoords.generator(10));
export { exercises };
