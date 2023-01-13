import { Affine, AffineConstructor } from "../../../polynomials/affine";
import { latexParser } from "../../../tree/parsers/latexParser";
import { AddNode } from "../../../tree/nodes/operators/addNode";
import { MultiplyNode } from "../../../tree/nodes/operators/multiplyNode";
import { SubstractNode } from "../../../tree/nodes/operators/substractNode";
import { random } from "../../../utils/random";
import { shuffle } from "../../../utils/shuffle";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

/**
 *  type (ax+b)(cx+d) ± (ax+b)(ex+f)
 */

export const factoType1Exercise: Exercise = {
  id: "facto1",
  connector: "=",
  instruction: "Factoriser :",
  isSingleStep: false,
  label: "Factorisation du type $(ax+b)(cx+d) \\pm (ax+b)(ex+f)$",
  levels: ["3", "2"],
  section: "Calcul littéral",
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
};

export function getFactoType1Question(): Question {
  const affines = AffineConstructor.differentRandoms(3);

  const permut: Affine[][] = [shuffle([affines[0], affines[1]]), shuffle([affines[0], affines[2]])];

  const operation = random(["add", "substract"]);

  const statementTree =
    operation === "add"
      ? new AddNode(
          new MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()),
          new MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree())
        )
      : new SubstractNode(
          new MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()),
          new MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree())
        );

  const answerTree = new MultiplyNode(
    affines[0].toTree(),
    affines[1].add(operation === "add" ? affines[2] : affines[2].opposite()).toTree()
  );

  const question: Question = {
    statement: latexParser(statementTree),
    answer: latexParser(answerTree),
  };
  return question;
}
