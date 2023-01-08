import { randint } from "../../../mathutils/random/randint";
import { Integer } from "../../../numbers/integer/integer";
import { RationalConstructor } from "../../../numbers/rationals/rational";
import { latexParse } from "../../../tree/latexParser/latexParse";
import { AddNode } from "../../../tree/nodes/operators/addNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const fractionAndIntegerSum: Exercise = {
  id: "fractionAndIntegerSum",
  connector: "=",
  instruction: "Calculer la forme irréductible :",
  label: "Sommes de fractions",
  levels: ["4", "3", "2", "1"],
  section: "Fractions",
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerSum, nb),
};

export function getFractionAndIntegerSum(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new AddNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();
  const answerTree = rational.add(integer).toTree();
  const question: Question = {
    statement: latexParse(statementTree),
    answer: latexParse(answerTree),
  };
  return question;
}
