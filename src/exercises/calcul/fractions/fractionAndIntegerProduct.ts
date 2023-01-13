import { randint } from "../../../mathutils/random/randint";
import { Integer } from "../../../numbers/integer/integer";
import { RationalConstructor } from "../../../numbers/rationals/rational";
import { latexParser } from "../../../tree/parsers/latexParser";
import { AddNode } from "../../../tree/nodes/operators/addNode";
import { MultiplyNode } from "../../../tree/nodes/operators/multiplyNode";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const fractionAndIntegerProduct: Exercise = {
  id: "fractionAndIntegerProduct",
  connector: "=",
  instruction: "Calculer la forme irréductible :",
  label: "Produit d'un entier et d'une fraction",
  levels: ["4", "3", "2", "1"],
  isSingleStep: false,
  section: "Fractions",
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerProduct, nb),
};

export function getFractionAndIntegerProduct(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new MultiplyNode(rational.toTree(), integer.toTree()).shuffle();

  const answerTree = rational.multiply(integer).toTree();
  const question: Question = {
    statement: latexParser(statementTree),
    answer: latexParser(answerTree),
  };
  return question;
}
