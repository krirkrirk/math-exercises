import { randint } from "../../../mathutils/random/randint";
import { Integer } from "../../../numbers/integer/integer";
import { RationalConstructor } from "../../../numbers/rationals/rational";
import { latexParse } from "../../../tree/latexParser/latexParse";
import { AddNode } from "../../../tree/nodes/operators/addNode";
import { DivideNode } from "../../../tree/nodes/operators/divideNode";
import { MultiplyNode } from "../../../tree/nodes/operators/multiplyNode";
import { random } from "../../../utils/random";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const fractionAndIntegerDivision: Exercise = {
  id: "fractionAndIntegerDivision",
  connector: "=",
  instruction: "Calculer la forme irréductible :",
  label: "Division d'un entier et d'une fraction",
  levels: ["4", "3", "2", "1"],
  isSingleStep: false,
  section: "Fractions",
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerDivision, nb),
};

export function getFractionAndIntegerDivision(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));

  const integerFirst = random([0, 1]);
  const statementTree = integerFirst
    ? new DivideNode(integer.toTree(), rational.toTree())
    : new DivideNode(rational.toTree(), integer.toTree());

  const answerTree = integerFirst ? integer.divide(rational).toTree() : rational.divide(integer).toTree();
  const question: Question = {
    statement: latexParse(statementTree),
    answer: latexParse(answerTree),
  };
  return question;
}
