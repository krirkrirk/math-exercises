import { Exercise } from "../src/exercises/exercise";
import { exosTest } from "./exosTest";
import * as PCExercises from "./../src/exercises/pc";
import "../src/prototypesEnhancement";
const pcExercises = Object.values(PCExercises) as Exercise<any>[];

test("xl", () => {
  try {
    exosTest(pcExercises);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
