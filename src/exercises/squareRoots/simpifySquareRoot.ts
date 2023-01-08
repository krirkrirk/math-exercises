import { SquareRootConstructor } from "../../numbers/reals/squareRoot";
import { latexParse } from "../../tree/latexParser/latexParse";
import { Exercise, Question } from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

export const simplifySquareRoot: Exercise = {
  connector: "=",
  instruction: "Simplifier :",
  label: "Simplification de racines carrées",
  levels: ["3", "2", "1"],
  section: "Racines carrées",
  generator: (nb: number) => getDistinctQuestions(getSimplifySquareRoot, nb),
};

export function getSimplifySquareRoot(): Question {
  const squareRoot = SquareRootConstructor.randomSimplifiable({
    allowPerfectSquare: false,
    maxSquare: 11,
  });
  const question: Question = {
    statement: latexParse(squareRoot.toTree()),
    answer: latexParse(squareRoot.simplify().toTree()),
  };
  return question;
}
