import { Integer } from "../../../numbers/integer/integer";
import { Rational } from "../../../numbers/rationals/rational";
import { Affine } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { latexParse } from "../../../tree/latexParser/latexParse";
import { EqualNode } from "../../../tree/nodes/operators/equalNode";
import { VariableNode } from "../../../tree/nodes/variables/variableNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

/**
 *  type ax+b=c
 */
export const equationType3Exercise: Exercise = {
  connector: "\\iff",
  instruction: "Résoudre : ",
  label: "Equations $ax+b=c$",
  levels: ["4", "3", "2"],
  section: "Calcul littéral",
  generator: (nb: number) =>
    getDistinctQuestions(getEquationType3ExerciseQuestion, nb),
};

export function getEquationType3ExerciseQuestion(): Question {
  const interval = new Interval("[[-10; 10]]");
  const intervalStar = new Interval("[[-10; 10]]").difference(
    new DiscreteSet([new Integer(0)])
  );
  const b = intervalStar.getRandomElement();
  const a = intervalStar.getRandomElement();
  const c = interval.getRandomElement();

  const affine = new Affine(a.value, b.value).toTree();
  const solution = new Rational(c.value - b.value, a.value).simplify();
  const statementTree = new EqualNode(affine, c.toTree());
  const answerTree = new EqualNode(new VariableNode("x"), solution.toTree());
  const question: Question = {
    statement: latexParse(statementTree),
    answer: latexParse(answerTree),
  };
  return question;
}
