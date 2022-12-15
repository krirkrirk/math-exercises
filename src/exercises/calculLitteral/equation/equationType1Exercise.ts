import { Equation } from "../../../equations/equations";
import { add } from "../../../operations/add";
import { substract } from "../../../operations/substract";
import { Affine, AffineConstructor } from "../../../polynomials/affine";
import { random } from "../../../utils/random";
import { shuffle } from "../../../utils/shuffle";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

/**
 *  type x+a=b
 */
export const equationType1Exercise: Exercise = {
  connector: "\\iff",
  instruction: "Résoudre : ",
  label: "Equations $x+a = b$",
  levels: ["4", "3", "2"],
  section: "Calcul littéral",
  generator: (nb: number) => getDistinctQuestions(getEquationType1ExerciseQuestion, nb),
  // questions: Question[];
  // constructor(nbOfQuestions: number) {
  //   this.questions = getDistinctQuestions(getFactoType1Question, nbOfQuestions);
  // }
};

export function getEquationType1ExerciseQuestion(): Question {
  const a = 
  const equa = new Equation("x+a", "b", )
  const statement = `(${permut[0][0]})(${permut[0][1]}) ${operation.tex} (${permut[1][0]})(${permut[1][1]})`;

  const answer = `(${affines[0]})(${operation.apply(affines[1], affines[2])})`;
  const question: Question = {
    statement,
    answer,
  };
  return question;
}
