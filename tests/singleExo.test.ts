import { Exercise } from "../src/exercises/exercise";
import { factoType2 } from "../src/exercises/math";
import { exosTest } from "./exosTest";
import "../src/prototypesEnhancement";

test("singleExo", () => {
  try {
    exosTest([factoType2 as Exercise<any>]);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
