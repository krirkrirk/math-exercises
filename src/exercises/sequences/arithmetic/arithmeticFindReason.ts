import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';

export const arithmeticFindReason: Exercise = {
  id: 'arithmeticFindReason',
  connector: '=',
  instruction: '',
  label: "Déterminer la raison d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  keys: ['r', 'n', 'u', 'underscore'],

  generator: (nb: number) => getDistinctQuestions(getArithmeticFindReason, nb),
};

export function getArithmeticFindReason(): Question {
  const rank1 = randint(0, 10);
  const rank2 = rank1 + 1;
  const reason = randint(-10, 10, [0]);
  const value1 = randint(-10, 10);
  const value2 = reason + value1;

  const question: Question = {
    instruction: `$(u_n)$ est une suite arithmétique. On sait que $u_{${rank1}} = ${value1}$ et $u_{${rank2}} = ${value2}$. Quelle est la raison de la suite $(u_n)$ ?`,
    startStatement: 'r',
    answer: reason.toString(),
    keys: ['r', 'n', 'u', 'underscore'],
  };
  return question;
}
