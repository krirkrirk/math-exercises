// import { Exercise, Question } from "src/exercises/exercise";
// import { getDistinctQuestions } from "src/exercises/utils/getDistinctQuestions";
// import { randint } from "src/math/utils/random/randint";

// export const geometricFindReason: Exercise = {
//   id: 'geometricFindReason',
//   connector: '=',
//   instruction: '',
//   label: "Utiliser la formule explicite d'une suite géométrique",
//   levels: ['1', '0'],
//   isSingleStep: false,
//   section: 'Suites',
//   generator: (nb: number) => getDistinctQuestions(getGeometricFindReason, nb),
// };

// export function getGeometricFindReason(): Question {
//   const rank = randint(0, 10);
//   const question: Question = {
//     instruction: `La suite $(u_n)$ est définie par $u_n = $. Calculer $u_{${rank}}$`,
//     startStatement: 'u_n',
//     answer: squareRoot.simplify().toTree().toTex(),
//   };
//   return question;
// }
