import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const geometricFindReason: Exercise = {
  id: 'geometricFindReason',
  connector: '=',
  instruction: '',
  label: "Déterminer la raison d'une suite géométrique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getGeometricFindReason, nb),
};

export function getGeometricFindReason(): Question {
  const rank1 = randint(0, 10);
  const rank2 = rank1 + 1;
  const reason = randint(2, 10);
  const value1 = randint(1, 10);
  const value2 = reason * value1;
  const question: Question = {
    instruction: `$(u_n)$ est une suite géométrique. On sait que $u_{${rank1}} = ${value1}$ et $u_{${rank2}} = ${value2}$. Quelle est la raison de la suite $(u_n)$ ?`,
    startStatement: 'q',
    answer: reason.toString(),
    keys: ['q', 'n', 'u', 'underscore'],
  };
  return question;
}
