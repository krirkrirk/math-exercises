import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const geometricReasonUsage: Exercise = {
  id: 'geometricReasonUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la raison d'une suite géométrique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getGeometricReasonUsage, nb),
};

export function getGeometricReasonUsage(): Question {
  const reason = randint(2, 10);
  const startRank = randint(0, 20);
  const askedRank = startRank + 1;
  const startValue = randint(1, 10);
  const question = {
    instruction: `$(u_n)$ est une suite géométrique de raison $q = ${reason}$ et $u_{${startRank}} = ${startValue}$. Calculer $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer: (startValue * reason).toString(),
  };
  return question;
}