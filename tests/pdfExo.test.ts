import { Exercise } from "../src/exercises/exercise";
import {
  imageAntecedentFromSentence,
  squareSideFromPerimeter,
  trigonometryAngleCalcul,
} from "../src/exercises/math";
import { forceWork } from "../src/exercises/pc";
import { buildPdfForExercise } from "./pdfs/buildPDFForExercise";
import "../src/prototypesEnhancement";

test("pdfExo", () => {
  try {
    buildPdfForExercise(trigonometryAngleCalcul as Exercise<any>);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
