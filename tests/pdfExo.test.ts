import { Exercise } from "../src/exercises/exercise";
import {
  imageAntecedentFromSentence,
  squareSideFromPerimeter,
} from "../src/exercises/math";
import { buildPdfForExercise } from "./pdfs/buildPDFForExercise";
import "../src/prototypesEnhancement";

test("pdfExo", () => {
  try {
    buildPdfForExercise(imageAntecedentFromSentence as Exercise<any>);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
