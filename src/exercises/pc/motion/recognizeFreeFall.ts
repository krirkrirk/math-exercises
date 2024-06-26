// import {
//   Exercise,
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

// type Identifiers = {};

// const getRecognizeFreeFallQuestion: QuestionGenerator<Identifiers> = () => {
//   const yStart = 10;
//   const freeFallPoints = [];
//   const commands = [];
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
//   while (propositions.length < n) {
//     throw Error("QCM not implemented");
//   }
//   return shuffleProps(propositions, n);
// };

// const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
//   throw Error("VEA not implemented");
// };
// export const recognizeFreeFall: Exercise<Identifiers> = {
//   id: "recognizeFreeFall",
//   connector: "",
//   label: "",
//   levels: [],
//   isSingleStep: true,
//   sections: [],
//   generator: (nb: number) =>
//     getDistinctQuestions(getRecognizeFreeFallQuestion, nb),
//   qcmTimer: 60,
//   freeTimer: 60,
//   getPropositions,
//   isAnswerValid,
//   subject: "Mathématiques",
// };
