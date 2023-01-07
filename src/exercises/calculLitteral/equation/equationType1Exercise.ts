import { Integer } from "../../../numbers/integer/integer";
import { Affine } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { latexParse } from "../../../tree/latexParser/latexParse";
import { EqualNode } from "../../../tree/nodes/operators/equalNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

/**
 *  type x+a=b
 */
export const equationType1Exercise: Exercise = {
  connector: "\\iff",
  instruction: "Résoudre : ",
  label: "Equations $x+a = b$",
  levels: ["4", "3", "2"],
  section: "Calcul littéral",
  generator: (nb: number) =>
    getDistinctQuestions(getEquationType1ExerciseQuestion, nb),
};

export function getEquationType1ExerciseQuestion(): Question {
  const interval = new Interval("[[-10; 10]]");
  const intervalStar = new Interval("[[-10; 10]]").difference(
    new DiscreteSet([new Integer(0)])
  );
  const b = interval.getRandomElement();
  const a = intervalStar.getRandomElement();
  const solution = b.value - a.value;
  const affine = new Affine(1, a.value).toTree();
  const tree = new EqualNode(affine, b.toTree());

  const question: Question = {
    statement: latexParse(tree),
    answer: `x = ${solution}`,
  };
  return question;
}
