import { Exercise } from "../src/exercises/exercise";
import {
  factoType2,
  marginalAndConditionalFrequency,
  readAbscissOnSemiLine,
} from "../src/exercises/math";
import { exosTest } from "./exosTest";
import "../src/prototypesEnhancement";
import { exoTest } from "./exoTest";

test("singleExo", () => {
  try {
    exoTest(readAbscissOnSemiLine as Exercise<any>);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
