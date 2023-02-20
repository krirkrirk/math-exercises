import { exercises } from './exercises/exercises';
import { midpoint } from './exercises/geometry/cartesian/midpoint';
import { mainRemarkableValuesExercise } from './exercises/trigonometry/mainRemarkableValues';
import { remarkableValuesExercise } from './exercises/trigonometry/remarkableValues';
import { AddNode } from './tree/nodes/operators/addNode';
import { VariableNode } from './tree/nodes/variables/variableNode';
import { simplifyNode } from './tree/parsers/simplify';
import { remarkableTrigoValues } from './trigonometry/remarkableValues';

console.log(remarkableValuesExercise.generator(10));

export { exercises };
