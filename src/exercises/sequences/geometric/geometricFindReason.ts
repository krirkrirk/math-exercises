import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const geometricFindReason: Exercise = {
  id: 'geometricFindReason',
  connector: '=',
  instruction: '',
  label: "Déterminer la raison d'une suite géométrique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getGeometricFindReason, nb),
  keys: ['q', 'n', 'u', 'underscore'],
};

export function getGeometricFindReason(): Question {
  const rank1 = randint(0, 10);
  const rank2 = rank1 + 1;
  const reason = randint(2, 10);
  const value1 = randint(1, 10);
  const value2 = reason * value1;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: reason + '',
      isRightAnswer: true,
    });

    if (value2 - value1 !== 2)
      res.push({
        id: v4() + '',
        statement: value2 - value1 + '',
        isRightAnswer: false,
      });

    for (let i = 0; i < (value2 - value1 === 2 ? n - 1 : n - 2); i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: reason + randint(1, 10) + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `$(u_n)$ est une suite géométrique. On sait que $u_{${rank1}} = ${value1}$ et $u_{${rank2}} = ${value2}$. Quelle est la raison de la suite $(u_n)$ ?`,
    startStatement: 'q',
    answer: reason.toString(),
    keys: ['q', 'n', 'u', 'underscore'],
    getPropositions,
  };
  return question;
}
