import { Exercise } from "../src/exercises/exercise";
import { exosTest } from "./exosTest";
import * as PCExercises from "./../src/exercises/pc";
import "../src/prototypesEnhancement";
const pcExercises = Object.values(PCExercises) as Exercise<any>[];

test("ml", () => {
  exosTest(pcExercises);
});
