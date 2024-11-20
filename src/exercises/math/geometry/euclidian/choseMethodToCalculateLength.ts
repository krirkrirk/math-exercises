// import {
//   Exercise,
//   Proposition,
//   QCMGenerator,
//   Question,
//   QuestionGenerator,
//   VEA,
//   addValidProp,
//   shuffleProps,
//   GetAnswer,
//   GetHint,
//   GetCorrection,
//   GetInstruction,
//   GetKeys,
//   tryToAddWrongProp,
// } from "#root/exercises/exercise";
// import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";

// type Identifiers = {
//   type: "pythagore" | "thalès" | "trigo";
// };

// const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
//   const propositions: Proposition[] = [];
//   addValidProp(propositions, answer, "raw");
//   tryToAddWrongProp(propositions, "Le théorème de Pythagore", "raw");
//   tryToAddWrongProp(propositions, "Le théorème de Thalès", "raw");
//   tryToAddWrongProp(propositions, "La trigonométrie", "raw");
//   return shuffleProps(propositions, n);
// };

// const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
//   switch (identifiers.type) {
//     case "pythagore":
//       return "Le théorème de Pythagore";
//     case "thalès":
//       return "Le théorème de Thalès";
//     case "trigo":
//       return "La trigonométrie";
//   }
// };

// const getInstruction: GetInstruction<Identifiers> = (identifiers) => {};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

// const getKeys: GetKeys<Identifiers> = (identifiers) => {
//   return [];
// };
// const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
//   throw Error("VEA not implemented");
// };

// const getChoseMethodToCalculateLengthQuestion: QuestionGenerator<
//   Identifiers
// > = () => {
//   const identifiers: Identifiers = {};
//   const question: Question<Identifiers> = {
//     answer: getAnswer(identifiers),
//     instruction: getInstruction(identifiers),
//     keys: getKeys(identifiers),
//     answerFormat: "tex",
//     identifiers,
//     hint: getHint(identifiers),
//     correction: getCorrection(identifiers),
//   };

//   return question;
// };

// export const choseMethodToCalculateLength: Exercise<Identifiers> = {
//   id: "choseMethodToCalculateLength",
//   connector: "",
//   label: undefined,
//   isSingleStep: true,
//   generator: (nb: number) =>
//     getDistinctQuestions(getChoseMethodToCalculateLengthQuestion, nb),
//   qcmTimer: 60,
//   freeTimer: 60,
//   getPropositions,
//   isAnswerValid,
//   subject: "Mathématiques",
//   getHint,
//   getCorrection,
//   getAnswer,
// };
