import { Integer } from "../../../numbers/integer/integer";
import { AffineConstructor } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { latexParse } from "../../../tree/latexParser/latexParse";
import { NumberNode } from "../../../tree/nodes/numbers/numberNode";
import { MultiplyNode } from "../../../tree/nodes/operators/multiplyNode";
import { PowerNode } from "../../../tree/nodes/operators/powerNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const secondIdentity: Exercise = {
  id: "idRmq2",
  connector: "=",
  instruction: "Développer et réduire :",
  label: "Identité remarquable $(a-b)^2$",
  levels: ["3", "2"],
  section: "Calcul Littéral",
  generator: (nb: number) => getDistinctQuestions(getSecondIdentityQuestion, nb),
};

export function getSecondIdentityQuestion(): Question {
  const intervalA = new Interval("[[0; 10]]").difference(new DiscreteSet([new Integer(0)]));
  const intervalB = new Interval("[[-10; 0]]").difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(intervalA, intervalB);

  const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answerTree = affine.multiply(affine).toTree();

  return {
    statement: latexParse(statementTree),
    answer: latexParse(answerTree),
  };
}
