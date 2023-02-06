import { Integer } from "../../../numbers/integer/integer";
import { AffineConstructor } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { latexParser } from "../../../tree/parsers/latexParser";
import { NumberNode } from "../../../tree/nodes/numbers/numberNode";
import { MultiplyNode } from "../../../tree/nodes/operators/multiplyNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const doubleDistributivity: Exercise = {
  id: "doubleDistri",
  connector: "=",
  instruction: "Développer et réduire :",
  label: "Distributivité double",
  levels: ["3", "2"],
  isSingleStep: false,
  section: "Calcul littéral",
  generator: (nb: number) => getDistinctQuestions(getDoubleDistributivityQuestion, nb),
};

export function getDoubleDistributivityQuestion(): Question {
  const interval = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0)]));
  const affines = AffineConstructor.differentRandoms(2, interval, interval);

  const statementTree = new MultiplyNode(affines[0].toTree(), affines[1].toTree());
  const answerTree = affines[0].multiply(affines[1]).toTree();

  return {
    startStatement: latexParser(statementTree),
    answer: latexParser(answerTree),
  };
}
