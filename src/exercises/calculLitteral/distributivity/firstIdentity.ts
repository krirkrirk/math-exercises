import { Integer } from "../../../numbers/integer/integer";
import { AffineConstructor } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { latexParse } from "../../../tree/latexParser/latexParse";
import { NumberNode } from "../../../tree/nodes/numbers/numberNode";
import { PowerNode } from "../../../tree/nodes/operators/powerNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const firstIdentity: Exercise = {
  connector: "=",
  instruction: "Développer et réduire :",
  label: "Identité remarquable $(a+b)^2$",
  levels: ["3", "2"],
  section: "Calcul Littéral",
  generator: (nb: number) => getDistinctQuestions(getFirstIdentityQuestion, nb),
};

export function getFirstIdentityQuestion(): Question {
  const interval = new Interval("[[1; 10]]").difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(interval, interval);

  const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answerTree = affine.multiply(affine).toTree();

  return {
    statement: latexParse(statementTree),
    answer: latexParse(answerTree),
  };
}
