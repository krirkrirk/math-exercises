// import { Exercise, Question } from "#root/exercises/exercise";
// import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
// import { randint } from "#root/math/utils/random/randint";

// export const geometricExplicitFormulaUsage: Exercise = {
//   id: 'geometricExplicitFormulaUsage',
//   connector: '=',
//   instruction: '',
//   label: "Utiliser la formule explicite d'une suite géométrique",
//   levels: ['1', '0'],
//   isSingleStep: false,
//   section: 'Suites',
//   generator: (nb: number) => getDistinctQuestions(getGeometricExplicitFormulaUsage, nb),
// };

// export function getGeometricExplicitFormulaUsage(): Question {
//   const rank = randint(0, 10);
//   const reason = randint()
//   const question: Question = {
//     instruction: `La suite $(u_n)$ est définie par $u_n = $. Calculer $u_{${rank}}$`,
//     startStatement: 'u_n',
//     answer: squareRoot.simplify().toTree().toTex(),
//   };
//   return question;
// }
