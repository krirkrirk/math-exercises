import { Integer } from "../../../numbers/integer/integer";
import { AffineConstructor } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { latexParser } from "../../../tree/parsers/latexParser";
import { NumberNode } from "../../../tree/nodes/numbers/numberNode";
import { MultiplyNode } from "../../../tree/nodes/operators/multiplyNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const simpleDistributivity: Exercise = {
  id: "simpleDistri",
  connector: "=",
  instruction: "Développer et réduire :",
  label: "Distributivité simple",
  levels: ["3", "2"],
  isSingleStep: false,
  section: "Calcul littéral",
  generator: (nb: number) => getDistinctQuestions(getSimpleDistributivityQuestion, nb),
};

export function getSimpleDistributivityQuestion(): Question {
  const interval = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(interval, interval);
  const coeff = interval.getRandomElement();

  const statementTree = new MultiplyNode(new NumberNode(coeff.value), affine.toTree());
  const answerTree = affine.times(coeff.value).toTree();
  return {
    statement: latexParser(statementTree),
    answer: latexParser(answerTree),
  };
}
