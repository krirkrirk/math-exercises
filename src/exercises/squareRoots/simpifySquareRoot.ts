import { SquareRootConstructor } from "../../numbers/reals/squareRoot";
import { latexParser } from "../../tree/parsers/latexParser";
import { Exercise, Question } from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

export const simplifySquareRoot: Exercise = {
  id: "simplifySqrt",
  connector: "=",
  instruction: "Simplifier :",
  label: "Simplification de racines carrées",
  levels: ["3", "2", "1"],
  isSingleStep: false,
  section: "Racines carrées",
  generator: (nb: number) => getDistinctQuestions(getSimplifySquareRoot, nb),
};

export function getSimplifySquareRoot(): Question {
  const squareRoot = SquareRootConstructor.randomSimplifiable({
    allowPerfectSquare: false,
    maxSquare: 11,
  });
  const question: Question = {
    statement: latexParser(squareRoot.toTree()),
    answer: latexParser(squareRoot.simplify().toTree()),
  };
  return question;
}
