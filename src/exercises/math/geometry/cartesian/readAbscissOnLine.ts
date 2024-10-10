// import {
//   Exercise,
//   Proposition,
//   QCMGenerator,
//   Question,
//   QuestionGenerator,
//   VEA,
//   GGBVEA,
//   addValidProp,
//   shuffleProps,
//   tryToAddWrongProp,
//   GetAnswer,
//   GetHint,
//   GetCorrection,
//   GetInstruction,
//   GetKeys,
//   GetGGBOptions,
//   GetStudentGGBOptions,
//   GetGGBAnswer,
// } from "#root/exercises/exercise";
// import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";

// type Identifiers = {
//   axisUnit: number; //for ggb
//   oneUnitTex: string;
//   absciss: number | [number, number];
// };

// const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
//   const propositions: Proposition[] = [];
//   addValidProp(propositions, answer);
//   while (propositions.length < n) {
//     throw Error("QCM not implemented");
//   }
//   return shuffleProps(propositions, n);
// };

// const getAnswer: GetAnswer<Identifiers> = (identifiers) => {};

// const getInstruction: GetInstruction<Identifiers> = (identifiers) => {};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};
// const getGGBAnswer: GetGGBAnswer<Identifiers> = (identifiers) => {};
// const getGGBOptions: GetGGBOptions<Identifiers> = (identifiers) => {};
// const getStudentGGBOptions: GetStudentGGBOptions<Identifiers> = (
//   identifiers,
// ) => {};

// const getKeys: GetKeys<Identifiers> = (identifiers) => {
//   return [];
// };
// const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
//   throw Error("VEA not implemented");
// };

// const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
//   throw Error("GGBVea not implemented");
// };

// const getReadAbscissOnLineQuestion: QuestionGenerator<Identifiers> = () => {
//   const identifiers: Identifiers = {
//     absciss,
//     axisUnit,
//     oneUnitTex,
//   };
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

// export const readAbscissOnLine: Exercise<Identifiers> = {
//   id: "readAbscissOnLine",
//   connector: "=",
//   label: "",
//   isSingleStep: true,
//   generator: (nb: number) =>
//     getDistinctQuestions(getReadAbscissOnLineQuestion, nb),
//   qcmTimer: 60,
//   freeTimer: 60,
//   ggbTimer: 60,
//   getPropositions,
//   isAnswerValid,
//   isGGBAnswerValid,
//   subject: "Mathématiques",
//   getHint,
//   getCorrection,
//   getAnswer,
//   getGGBAnswer,
//   getGGBOptions,
//   getStudentGGBOptions,
//   rebuildIdentifiers,
// };
