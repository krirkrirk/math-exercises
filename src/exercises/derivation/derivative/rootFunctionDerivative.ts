import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';

export const rootFunctionDerivative: Exercise = {
  id: 'rootFunctionDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une fonction racine",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getRootFunctionDerivative, nb),
  keys: ['x'],
};

export function getRootFunctionDerivative(): Question {
  const a = randint(-9, 10, [0]);

  let instruction = `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =$ `;
  let answer = '';

  if (a === 1) instruction += `$\\sqrt{x}$.`;
  else if (a === -1) instruction += `$-\\sqrt{x}$.`;
  else instruction += `$${a}\\sqrt{x}$.`;

  if (a / 2 === round(a / 2, 0)) answer = `\\frac{${a / 2}}{\\sqrt{x}}`;
  else answer = `\\frac{${a}}{2\\sqrt{x}}`;

  const question: Question = {
    instruction,
    startStatement: `f'(x)`,
    answer,
    keys: ['x'],
  };

  return question;
}
