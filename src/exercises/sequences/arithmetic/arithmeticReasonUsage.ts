import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const arithmeticReasonUsage: Exercise = {
  id: 'arithmeticReasonUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la raison d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticReasonUsage, nb),
};

export function getArithmeticReasonUsage(): Question {
  const reason = randint(-10, 10, [0]);
  const startRank = randint(0, 20);
  const askedRank = startRank + 1;
  const startValue = randint(-10, 10);
  const question = {
    instruction: `$(u_n)$ est une suite arithmétique de raison $r = ${reason}$ et on sait que $u_{${startRank}} = ${startValue}$. Calculer : `,
    startStatement: `u_{${askedRank}}`,
    answer: (startValue + reason).toString(),
    keys: ['r', 'n', 'u', 'underscore'],
  };
  return question;
}
