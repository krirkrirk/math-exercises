import { add } from "../../../operations/add";
import { multiply } from "../../../operations/multiply";
import { substract } from "../../../operations/substract";
import { Affine, AffineConstructor } from "../../../polynomials/affine";
import { latexParse } from "../../../tree/latexParser/latexParse";
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
  connector: "=",
  instruction: "Factoriser :",
  label: "Factorisation du type $(ax+b)(cx+d) \\pm (ax+b)(ex+f)$",
  levels: ["3", "2"],
  section: "Calcul Littéral",
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
};

export function getFactoType1Question(): Question {
  const affines = AffineConstructor.differentRandoms(3);

  const permut: Affine[][] = [
    [affines[0], affines[1]],
    [affines[0], affines[2]],
  ];
  shuffle(permut[0]);
  shuffle(permut[1]);

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
    affines[1]
      .add(operation === "add" ? affines[2] : affines[2].opposite())
      .toTree()
  );

  const question: Question = {
    statement: latexParse(statementTree),
    answer: latexParse(answerTree),
  };
  return question;
}
