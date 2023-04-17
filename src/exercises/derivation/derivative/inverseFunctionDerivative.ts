import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const inverseFunctionDerivative: Exercise = {
  id: 'inverseFunctionDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une fonction inverse",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getInverseFunctionDerivative, nb),
  keys: ['x'],
};

export function getInverseFunctionDerivative(): Question {
  const a = randint(-10, 10, [0]);

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =\\frac{${a}}{x}$ `,
    startStatement: `f'(x)`,
    answer: `\\frac{${-a}}{x^2}`,
    keys: ['x'],
  };

  return question;
}
