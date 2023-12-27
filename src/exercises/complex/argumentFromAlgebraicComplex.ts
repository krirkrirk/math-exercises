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
// import { ComplexConstructor } from "#root/math/complex/complex";

// type Identifiers = {
//   re: number;
//   im: number;
// };

// const getArgumentFromAlgebraicComplexQuestion: QuestionGenerator<
//   Identifiers
// > = () => {
//   const z = ComplexConstructor.random();
//   const zTex = z.toTree().toTex();
//   const answer = z.toModuleTree().toTex();
//   const question: Question<Identifiers> = {
//     answer: answer,
//     instruction: `Soit $z=${zTex}$. Déterminer le module $|z|$ de $z$.`,
//     keys: [],
//     answerFormat: "tex",
//     identifiers: {  re: z.re, im: z.im },
//   };

//   return question;
// };

// const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
//   const propositions: Proposition[] = [];
//   addValidProp(propositions, answer);
//   while (propositions.length < n) {}
//   return shuffleProps(propositions, n);
// };
// export const argumentFromAlgebraicComplex: MathExercise<Identifiers> = {
//   id: "argumentFromAlgebraicComplex",
//   connector: "=",
//   label: "Déterminer l'argument d'un nombre complexe via sa forme algébrique",
//   levels: ["MathExp"],
//   isSingleStep: true,
//   sections: ["Nombres complexes"],
//   generator: (nb: number) =>
//     getDistinctQuestions(getArgumentFromAlgebraicComplexQuestion, nb),
//   qcmTimer: 60,
//   freeTimer: 60,
//   getPropositions,
// };
