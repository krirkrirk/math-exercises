import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const arithmeticReasonUsage: Exercise = {
  id: 'arithmeticReasonUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la raison d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticReasonUsage, nb),
  keys: ['r', 'n', 'u', 'underscore'],
};

export function getArithmeticReasonUsage(): Question {
  const reason = randint(-10, 10, [0]);
  const startRank = randint(0, 20);
  const askedRank = startRank + 1;
  const startValue = randint(-10, 10);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: (startValue + reason).toString(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: startValue + reason + randint(-5, 6, [0]) + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question = {
    instruction: `$(u_n)$ est une suite arithmétique de raison $r = ${reason}$ et on sait que $u_{${startRank}} = ${startValue}$. Calculer : `,
    startStatement: `u_{${askedRank}}`,
    answer: (startValue + reason).toString(),
    keys: ['r', 'n', 'u', 'underscore'],
    getPropositions,
  };
  return question;
}
