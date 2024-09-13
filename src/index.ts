// import { exercises } from "./exercises/exercises";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { AddNode } from "./tree/nodes/operators/addNode";
import * as MathExercises from "./exercises/math";
import * as PCExercises from "./exercises/pc";

import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "./tree/nodes/numbers/infiniteNode";
import { AlgebraicNode } from "./tree/nodes/algebraicNode";
import { toScientific } from "./utils/numberPrototype/toScientific";
import { VariableNode } from "./tree/nodes/variables/variableNode";
import "./prototypesEnhancement";

const mathExercises = Object.values(MathExercises);
const pcExercises = Object.values(PCExercises);

export { mathExercises, pcExercises };
