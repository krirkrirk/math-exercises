import { Exercise } from "../src/exercises/exercise";
import {
  factoType2,
  marginalAndConditionalFrequency,
} from "../src/exercises/math";
import { exosTest } from "./exosTest";
import "../src/prototypesEnhancement";
import { exoTest } from "./exoTest";

test("singleExo", () => {
  try {
    exoTest(marginalAndConditionalFrequency as Exercise<any>);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
