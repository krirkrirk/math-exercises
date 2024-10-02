import { Exercise } from "../src/exercises/exercise";
import { exosTest } from "./exosTest";
import * as MathExercises from "./../src/exercises/math";
import "../src/prototypesEnhancement";

const mathExercises = Object.values(MathExercises) as Exercise<any>[];

test("ml", () => {
  try {
    exosTest(mathExercises);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
