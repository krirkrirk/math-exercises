import { Expression } from "../../../expression/expression";
import { add } from "../../../operations/add";
import { substract } from "../../../operations/substract";
import { Affine, AffineConstructor } from "../../../polynomials/affine";
import { random } from "../../../utils/random";
import { shuffle } from "../../../utils/shuffle";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

/**
 *
 * @returns type (ax+b)(cx+d) +- (ax+b)(ex+f)
 */

export class FactoType1Exercise implements Exercise {
  connector = "=";
  instruction = "Factoriser :";
  label = "Factorisation du type $(ax+b)(cx+d) \\pm (ax+b)(ex+f)$";
  levels = ["3", "2"];
  section = "Calcul Littéral";
  questions: Question[];
  constructor(nbOfQuestions: number) {
    this.questions = getDistinctQuestions(getFactoType1Question, nbOfQuestions);
  }
}

export const getFactoType1Question = () => {
  const affines = AffineConstructor.differentRandoms(3);

  const permut: Affine[][] = [
    [affines[0], affines[1]],
    [affines[0], affines[2]],
  ];
  shuffle(permut[0]);
  shuffle(permut[1]);

  const operation = random([add, substract]);

  const statement = `(${permut[0][0]})(${permut[0][1]}) ${operation.tex} (${permut[1][0]})(${permut[1][1]})`;

  const answer = `(${affines[0]})(${operation.apply(affines[1], affines[2])})`;
  return { statement, answer };
};
