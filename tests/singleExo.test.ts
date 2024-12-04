import { Exercise } from "../src/exercises/exercise";
import {
  factoType2,
  lengthConversion,
  marginalAndConditionalFrequency,
  readAbscissOnSemiLine,
  thales,
  thalesCalcul,
} from "../src/exercises/math";
import { exosTest } from "./exosTest";
import "../src/prototypesEnhancement";
import { exoTest } from "./exoTest";

test("singleExo", () => {
  try {
    exoTest(thalesCalcul as Exercise<any, any>);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
