import { exercises } from './exercises/exercises';
import { midpoint } from './exercises/geometry/cartesian/midpoint';
import { AddNode } from './tree/nodes/operators/addNode';
import { VariableNode } from './tree/nodes/variables/variableNode';
import { simplifyNode } from './tree/parsers/simplify';
// import { simplify } from './tree/parsers/simplify';

// exercises.forEach((exo) => {
//   console.log(exo.instruction, exo.generator(10));
// });

// import { scalarProductViaCoords } from './exercises/geometry/vectors/scalarProductViaCoords';

// console.log(scalarProductViaCoords.generator(10));
// console.log(midpoint.generator(10));
export { exercises };
