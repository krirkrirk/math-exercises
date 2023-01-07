import { add } from "../../../operations/add";
import { multiply } from "../../../operations/multiply";
import { substract } from "../../../operations/substract";
import { Affine, AffineConstructor } from "../../../polynomials/affine";
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

  const operation = random([add, substract]);

  const statement = operation.texApply(
    multiply.texApply(permut[0][0], permut[0][1]),
    multiply.texApply(permut[1][0], permut[1][1])
  );

  // `(${permut[0][0]})(${permut[0][1]}) ${operation.tex} (${permut[1][0]})(${permut[1][1]})`;

  const answer = multiply.texApply(affines[0], operation.mathApply(affines[1], affines[2]));
  // const answer = `(${affines[0]})(${operation.mathApply(affines[1], affines[2])})`;
  const question: Question = {
    statement,
    answer,
  };
  return question;
}
