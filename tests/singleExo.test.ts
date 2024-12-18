import { Exercise } from "../src/exercises/exercise";
import {
  absolueValueAffineEquation,
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
    exoTest(absolueValueAffineEquation as Exercise<any, any>);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
