import { Integer } from "../../../numbers/integer/integer";
import { Rational } from "../../../numbers/rationals/rational";
import { Affine } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { latexParser } from "../../../tree/parsers/latexParser";
import { EqualNode } from "../../../tree/nodes/operators/equalNode";
import { VariableNode } from "../../../tree/nodes/variables/variableNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

/**
 *  type ax+b=cx+d
 */
export const equationType4Exercise: Exercise = {
  id: "equa4",

  connector: "\\iff",
  instruction: "Résoudre : ",
  label: "Equations $ax+b=cx+d$",
  levels: ["4", "3", "2"],
  section: "Calcul littéral",
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationType4ExerciseQuestion, nb),
};

export function getEquationType4ExerciseQuestion(): Question {
  const interval = new Interval("[[-10; 10]]");
  const intervalStar = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0)]));
  const a = intervalStar.getRandomElement();
  const b = interval.getRandomElement();
  const intervalC = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0), new Integer(a.value)]));
  const c = intervalC.getRandomElement();
  const d = interval.getRandomElement();

  const affines = [new Affine(a.value, b.value), new Affine(c.value, d.value)];
  const solution = new Rational(d.value - b.value, a.value - c.value).simplify();

  const statementTree = new EqualNode(affines[0].toTree(), affines[1].toTree());
  const answerTree = new EqualNode(new VariableNode("x"), solution.toTree());
  const question: Question = {
    statement: latexParser(statementTree),
    answer: latexParser(answerTree),
  };
  return question;
}
