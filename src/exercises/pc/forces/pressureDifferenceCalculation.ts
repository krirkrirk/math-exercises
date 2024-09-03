// import { frenchify } from "#root/math/utils/latex/frenchify";
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
// import { randint } from "#root/math/utils/random/randint";
// import { round, roundSignificant } from "#root/math/utils/round";
// import { random } from "#root/utils/random";

// const g = 9.81; // Accélération due à la gravité en m·s⁻²

// type Identifiers = {
//   density: number; // Densité du fluide en kg·m⁻³
//   depth1: number; // Profondeur 1 en m
//   depth2: number; // Profondeur 2 en m
// };

// const getPressureDifferenceQuestion: QuestionGenerator<Identifiers> = () => {
//   const density = round(randint(900, 1100), 3); // Densité de l'eau ou un fluide similaire
//   const depth1 = randint(0, 50); // Profondeur en mètres
//   const depth2 = randint(depth1 + 1, 100); // Profondeur plus profonde

//   const deltaDepth = depth2 - depth1; // Différence de profondeur en m
//   const pressureDifference = round(density * g * deltaDepth, 2); // Différence de pression en Pa

//   const questionText = `Dans un fluide incompressible de densité $\\rho = ${frenchify(
//     density,
//   )}\\ \\text{kg·m}^{-3}$, déterminez la différence de pression $\\Delta P$ entre deux positions verticales de profondeur $z_1 = ${frenchify(
//     depth1,
//   )}\\ \\text{m}$ et $z_2 = ${frenchify(depth2)}\\ \\text{m}$.`;

//   const hint = `La différence de pression entre deux positions dans un fluide incompressible est donnée par la relation :
//     $$
//     \\Delta P = \\rho \\times g \\times (z_2 - z_1)
//     $$
//     où $\\rho$ est la densité du fluide en $\\text{kg·m}^{-3}$, $g$ est l'accélération due à la gravité en $\\text{m·s}^{-2}$, et $z_2 - z_1$ est la différence de profondeur en $\\text{m}$.`;

//   const correction = `La différence de pression est calculée comme suit :
//     $$
//     \\Delta P = \\rho \\times g \\times (z_2 - z_1)
//     $$

// En remplaçant par les valeurs fournies :
//     $$
//     \\Delta P = ${frenchify(density)} \\times ${frenchify(
//     g,
//   )} \\times (${frenchify(depth2)} - ${frenchify(depth1)}) = ${frenchify(
//     pressureDifference,
//   )}\\ \\text{Pa}
//     $$`;

//   const question: Question<Identifiers> = {
//     answer: pressureDifference.toTree().toTex(),
//     instruction: questionText,
//     hint,
//     correction,
//     keys: [],
//     answerFormat: "tex",
//     identifiers: {
//       density,
//       depth1,
//       depth2,
//     },
//   };

//   return question;
// };

// const getPropositions: QCMGenerator<Identifiers> = (
//   n,
//   { answer, density, depth1, depth2 },
// ) => {
//   const propositions: Proposition[] = [];
//   addValidProp(propositions, answer);

//   const wrongAnswers = [
//     roundSignificant(density * g * (depth1 + depth2), 2),
//     roundSignificant(density * g * (depth2 - depth1) * 0.5, 2),
//     roundSignificant(density * g * (depth2 + depth1), 2),
//     roundSignificant(density * g * (depth2 - depth1 + 1), 2),
//   ];

//   wrongAnswers.forEach((wrongAnswer) => {
//     tryToAddWrongProp(propositions, wrongAnswer);
//   });

//   while (propositions.length < n) {
//     tryToAddWrongProp(
//       propositions,
//       round(randint(1000, 100000), 2).toTree().toTex(),
//     );
//   }

//   return shuffleProps(propositions, n);
// };

// const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
//   return ans === answer;
// };

// export const pressureDifferenceCalculation: Exercise<Identifiers> = {
//   id: "pressureDifferenceCalculation",
//   label: "Calculer la différence de pression dans un fluide incompressible",
//   levels: ["1reSpé"],
//   isSingleStep: true,
//   sections: ["Fluides"],
//   generator: (nb: number) =>
//     getDistinctQuestions(getPressureDifferenceQuestion, nb),
//   qcmTimer: 60,
//   freeTimer: 60,
//   getPropositions,
//   isAnswerValid,
//   subject: "Physique",
// };
