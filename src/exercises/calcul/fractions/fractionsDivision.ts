import { RationalConstructor } from "../../../numbers/rationals/rational";
import { latexParse } from "../../../tree/latexParser/latexParse";
import { AddNode } from "../../../tree/nodes/operators/addNode";
import { DivideNode } from "../../../tree/nodes/operators/divideNode";
import { MultiplyNode } from "../../../tree/nodes/operators/multiplyNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const fractionsDivision: Exercise = {
  id: "fractionsDivision",
  connector: "=",
  instruction: "Calculer la forme irréductible :",
  label: "Divisions de fractions",
  levels: ["4", "3", "2", "1"],
  section: "Fractions",
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsDivision, nb),
};

export function getFractionsDivision(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new DivideNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.divide(rational2).toTree();
  const question: Question = {
    statement: latexParse(statementTree),
    answer: latexParse(answerTree),
  };
  return question;
}
