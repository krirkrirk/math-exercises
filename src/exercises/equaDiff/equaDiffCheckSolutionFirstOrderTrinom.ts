// import {
//   MathExercise,
//   Proposition,
//   QCMGenerator,
//   Question,
//   QuestionGenerator,
//   VEA,
//   addValidProp,
//   shuffleProps,
//   tryToAddWrongProp,
// } from "#root/exercises/exercise";
// import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
// import { TrinomConstructor } from "#root/math/polynomials/trinom";

// type Identifiers = {};

// /**y = y' + dx^2+ex+f, alors y = ax^2+bx+c */
// const getEquaDiffCheckSolutionFirstOrderQuestion: QuestionGenerator<
//   Identifiers
// > = () => {
//   const trinom = TrinomConstructor.random();
//   const d = trinom.a;
//   const e = trinom.b - 2 * trinom.a;
//   const f = trinom.c - trinom.b;

//   const question: Question<Identifiers> = {
//     answer,
//     instruction: ``,
//     keys: [],
//     answerFormat: "tex",
//     identifiers: {},
//   };

//   return question;
// };

// const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
//   const propositions: Proposition[] = [];
//   addValidProp(propositions, answer);
//   while (propositions.length < n) {}
//   return shuffleProps(propositions, n);
// };

// const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {};
// export const equaDiffCheckSolutionFirstOrder: MathExercise<Identifiers> = {
//   id: "equaDiffCheckSolutionFirstOrder",
//   connector: "",
//   label: "",
//   levels: [],
//   isSingleStep: true,
//   sections: [],
//   generator: (nb: number) =>
//     getDistinctQuestions(getEquaDiffCheckSolutionFirstOrderQuestion, nb),
//   qcmTimer: 60,
//   freeTimer: 60,
//   getPropositions,
//   isAnswerValid,
// };
