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
 *  type ax=b
 */
export const equationType2Exercise: Exercise = {
  id: "equa2",

  connector: "\\iff",
  instruction: "Résoudre : ",
  label: "Equations $ax=b$",
  levels: ["4", "3", "2"],
  section: "Calcul littéral",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEquationType2ExerciseQuestion, nb),
};

export function getEquationType2ExerciseQuestion(): Question {
  const interval = new Interval("[[-10; 10]]");
  const intervalStar = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0)]));
  const b = interval.getRandomElement();
  const a = intervalStar.getRandomElement();
  const solution = new Rational(b.value, a.value).simplify();
  const affine = new Affine(a.value, 0).toTree();
  const tree = new EqualNode(affine, b.toTree());
  const answer = new EqualNode(new VariableNode("x"), solution.toTree());
  const question: Question = {
    statement: latexParser(tree),
    answer: latexParser(answer),
  };
  return question;
}
