import { randint } from "../../../mathutils/random/randint";
import { DecimalConstructor } from "../../../numbers/decimals/decimal";
import { latexParser } from "../../../tree/parsers/latexParser";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

/**
 * arrondi à l'unité
 */
export const roundToUnit: Exercise = {
  id: "roundToUnit",
  connector: "\\approx",
  instruction: "Arrondir à l'unité :",
  label: "Arrondir à l'unité",
  levels: ["6", "5"],
  section: "Calculs",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(0), nb),
};
/**
 * arrondi à l'unité
 */
export const roundToDizieme: Exercise = {
  id: "roundToDizieme",
  connector: "\\approx",
  instruction: "Arrondir au dizième :",
  label: "Arrondir au dizième",
  levels: ["6", "5"],
  section: "Calculs",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(1), nb),
};
/**
 * arrondi à l'unité
 */
export const roundToCentieme: Exercise = {
  id: "roundToCentieme",
  connector: "\\approx",
  instruction: "Arrondir au centième :",
  label: "Arrondir au centième",
  levels: ["6", "5"],
  section: "Calculs",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(2), nb),
};
/**
 * arrondi à l'unité
 */
export const roundToMillieme: Exercise = {
  id: "roundToMillieme",
  connector: "\\approx",
  instruction: "Arrondir au millième :",
  label: "Arrondir au millième",
  levels: ["6", "5"],
  section: "Calculs",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(3), nb),
};

export function getRoundQuestions(precisionAsked: number = 0): Question {
  const precision = randint(precisionAsked + 1, precisionAsked + 5);
  const dec = DecimalConstructor.random(0, 1000, precision);
  const question: Question = {
    startStatement: latexParser(dec.toTree()),
    answer: latexParser(dec.round(precisionAsked).toTree()),
  };
  return question;
}
