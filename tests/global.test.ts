import { AlgebraicNode } from "../src/tree/nodes/algebraicNode";
import * as MathExercises from "./../src/exercises/math";
import * as PCExercises from "./../src/exercises/pc";

import { Exercise } from "./../src/exercises/exercise";
import { NumberNode } from "./../src/tree/nodes/numbers/numberNode";
import { MinusInfinityNode } from "./../src/tree/nodes/numbers/infiniteNode";
import { PlusInfinityNode } from "./../src/tree/nodes/numbers/infiniteNode";
import { toScientific } from "../src/utils/numberPrototype/toScientific";
import { VariableNode } from "../src/tree/nodes/variables/variableNode";
import { questionTest } from "./questionTest";
import { exoTest } from "./exoTest";
import "../src/prototypesEnhancement";
import { exosTest } from "./exosTest";
const mathExercises = Object.values(MathExercises) as Exercise<any>[];
const pcExercises = Object.values(PCExercises) as Exercise<any>[];

test("all exos", () => {
  const allExos = [...mathExercises, ...pcExercises];
  exosTest(allExos);
});
