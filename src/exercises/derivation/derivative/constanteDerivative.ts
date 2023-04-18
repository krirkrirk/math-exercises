import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const constanteDerivative: Exercise = {
  id: 'constanteDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une constante",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getConstanteDerivative, nb),
  keys: ['x'],
};

export function getConstanteDerivative(): Question {
  const c = randint(-9, 10, [0]);

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${c}$ `,
    startStatement: `f'(x)`,
    answer: '0',
    keys: [],
  };

  return question;
}
