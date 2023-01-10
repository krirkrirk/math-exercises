// import { Interval } from "../../sets/intervals/intervals";
// import { Exercise, Question } from "../exercise";
// import { getDistinctQuestions } from "../utils/getDistinctQuestions";

// export const reduction: Exercise = {
//   id: "reduction",
//   connector: "=",
//   instruction: "Réduire :",
//   label: "Réduire une expression polynomiale",
//   levels: ["3", "2"],
//   isSingleStep: false,
//   section: "Calcul Littéral",
//   generator: (nb: number) => getDistinctQuestions(getReductionQuestion, nb),
// };

// export function getReductionQuestion(): Question {
//   const interval = new Interval("[[1; 10]]").difference(new DiscreteSet([new Integer(0)]));
//   const affine = AffineConstructor.random(interval, interval);

//   const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
//   const answerTree = affine.multiply(affine).toTree();

//   return {
//     statement: latexParse(statementTree),
//     answer: latexParse(answerTree),
//   };
// }
