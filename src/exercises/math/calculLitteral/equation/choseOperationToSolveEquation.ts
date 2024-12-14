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
// import { randint } from "#root/math/utils/random/randint";
// import {
//   EqualNode,
//   EqualNodeConstructor,
//   EqualNodeIdentifiers,
// } from "#root/tree/nodes/equations/equalNode";
// import {
//   NodeConstructor,
//   NodeIdentifiers,
// } from "#root/tree/nodes/nodeConstructor";

// type Identifiers = {
//   equaIdentifiers: EqualNodeIdentifiers;
// };

// const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
//   const propositions: Proposition[] = [];
//   addValidProp(propositions, answer);
//   tryToAddWrongProp(propositions, "une soustraction", "raw");
//   tryToAddWrongProp(propositions, "une addition", "raw");
//   tryToAddWrongProp(propositions, "une division", "raw");
//   tryToAddWrongProp(propositions, "une multiplication", "raw");

//   return shuffleProps(propositions, n);
// };

// const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
//   return;
// };

// const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
//   const equation = EqualNodeConstructor.fromIdentifiers(
//     identifiers.equaIdentifiers,
//   );
//   return `Pour résoudre l'équation :

// $$
// ${equation.toTex()}
// $$

// il faut d'abord effectuer :
// `;
// };

// // const getHint: GetHint<Identifiers> = (identifiers) => {};
// // const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

// const getKeys: GetKeys<Identifiers> = (identifiers) => {
//   return [];
// };
// const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
//   throw Error("VEA not implemented");
// };

// const getChoseOperationToSolveEquationQuestion: QuestionGenerator<
//   Identifiers
// > = (ops) => {
//   //ax=b avec a entier, ax+b = c tout entier, x/a = b tout entier, x+-a = b entiers ,
//   let a: number;
//   let b: number;
//   let c: number | undefined;
//   const type = randint(1, 7);
//   switch (type) {
//     case 1:
//       //ax = b tous entiers
//       a = randint(-10);
//       break;
//     case 2:
//       break;
//     case 3:
//       break;
//     case 4:
//       break;
//     case 5:
//       break;
//     case 6:
//       break;
//     case 7:
//       break;
//   }
//   const identifiers: Identifiers = {};
//   const question: Question<Identifiers> = {
//     answer: getAnswer(identifiers),
//     instruction: getInstruction(identifiers),
//     keys: getKeys(identifiers),
//     answerFormat: "tex",
//     identifiers,
//     // hint: getHint(identifiers),
//     // correction: getCorrection(identifiers),
//   };

//   return question;
// };

// export const choseOperationToSolveEquation: Exercise<Identifiers> = {
//   id: "choseOperationToSolveEquation",
//   connector: "=",
//   label:
//     "Choisir la bonne opération pour résoudre une équation du premier degré",
//   isSingleStep: true,
//   generator: (nb, opts) =>
//     getDistinctQuestions(
//       () => getChoseOperationToSolveEquationQuestion(opts),
//       nb,
//     ),
//   qcmTimer: 60,
//   freeTimer: 60,
//   getPropositions,
//   isAnswerValid,
//   subject: "Mathématiques",
//   getInstruction,
//   // getHint,
//   // getCorrection,
//   getAnswer,
//   answerType: "QCU",
// };
