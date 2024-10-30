import { Exercise } from "../src/exercises/exercise";
import {
  imageAntecedentFromSentence,
  squareSideFromPerimeter,
  trigonometryAngleCalcul,
} from "../src/exercises/math";
import { forceWork } from "../src/exercises/pc";
import { buildPdfForExercise } from "./pdfs/buildPDFForExercise";
import "../src/prototypesEnhancement";
import * as MathExercises from "./../src/exercises/math";
import * as PCExercises from "./../src/exercises/pc";
import fs from "fs";
const mathExercises = Object.values(MathExercises) as Exercise<any>[];
const pcExercises = Object.values(PCExercises) as Exercise<any>[];

test("pdfExo", () => {
  try {
    fs.rmSync(__dirname + "/pdfs/dump", { recursive: true, force: true });
    fs.mkdirSync(__dirname + "/pdfs/dump");
    const exos = pcExercises.slice(110, 140);
    for (const exo of exos) {
      buildPdfForExercise(exo as Exercise<any>);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});
