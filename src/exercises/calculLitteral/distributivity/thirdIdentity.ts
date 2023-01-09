import { Integer } from "../../../numbers/integer/integer";
import { Affine, AffineConstructor } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { latexParse } from "../../../tree/latexParser/latexParse";
import { NumberNode } from "../../../tree/nodes/numbers/numberNode";
import { MultiplyNode } from "../../../tree/nodes/operators/multiplyNode";
import { PowerNode } from "../../../tree/nodes/operators/powerNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const thirdIdentity: Exercise = {
  id: "idRmq3",
  connector: "=",
  instruction: "Développer et réduire :",
  label: "Identité remarquable $(a+b)(a-b)$",
  levels: ["3", "2"],
  isSingleStep: false,
  section: "Calcul Littéral",
  generator: (nb: number) => getDistinctQuestions(getThirdIdentityQuestion, nb),
};

export function getThirdIdentityQuestion(): Question {
  const interval = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(interval, interval);
  const affine2 = new Affine(affine.a, -affine.b);
  const statementTree = new MultiplyNode(affine.toTree(), affine2.toTree());
  const answerTree = affine.multiply(affine2).toTree();

  return {
    statement: latexParse(statementTree),
    answer: latexParse(answerTree),
  };
}
